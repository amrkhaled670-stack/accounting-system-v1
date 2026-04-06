"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVatRate, calculateTax, calculateLineTotal } from "@/lib/tax";
import { generateInvoiceNumber } from "@/lib/numbering";

export async function getInvoices() {
  return prisma.invoice.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoice(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { item: true } },
      payments: true,
    },
  });
}

export type InvoiceLineInput = {
  itemId: string;
  quantity: number;
  unitPrice: number;
};

export async function createInvoice(data: {
  customerId: string;
  taxExempt: boolean;
  notes: string;
  lines: InvoiceLineInput[];
}) {
  const vatRate = await getVatRate();
  const customer = await prisma.customer.findUniqueOrThrow({
    where: { id: data.customerId },
  });

  let subtotal = 0;
  let totalTax = 0;

  const itemIds = data.lines.map((l) => l.itemId);
  const items = await prisma.item.findMany({ where: { id: { in: itemIds } } });
  const itemMap = new Map(items.map((i) => [i.id, i]));

  const invoiceItems = data.lines.map((line) => {
    const item = itemMap.get(line.itemId);
    const tax = calculateTax({
      amount: line.quantity * line.unitPrice,
      vatRate,
      entityTaxExempt: customer.taxExempt,
      itemTaxExempt: item?.taxExempt ?? false,
      manualOverride: data.taxExempt,
    });

    const lineTotals = calculateLineTotal(line.quantity, line.unitPrice, tax.taxRate);
    subtotal += lineTotals.subtotal;
    totalTax += lineTotals.taxAmount;

    return {
      itemId: line.itemId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      taxRate: tax.taxRate,
      taxAmount: lineTotals.taxAmount,
      totalPrice: lineTotals.totalPrice,
    };
  });

  const invoiceNumber = await generateInvoiceNumber();

  await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: data.customerId,
      taxExempt: data.taxExempt,
      notes: data.notes || null,
      subtotal,
      taxAmount: totalTax,
      totalAmount: subtotal + totalTax,
      items: { create: invoiceItems },
    },
  });

  revalidatePath("/invoices");
  redirect("/invoices");
}

export async function issueInvoice(id: string) {
  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id },
  });

  if (invoice.status !== "draft") return;

  // إصدار الفاتورة + تحديث مديونية العميل
  await prisma.$transaction([
    prisma.invoice.update({
      where: { id },
      data: { status: "issued" },
    }),
    prisma.customer.update({
      where: { id: invoice.customerId },
      data: { balance: { increment: invoice.totalAmount } }, // العميل مدين لنا
    }),
  ]);

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/customers");
}

export async function cancelInvoice(id: string) {
  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id },
  });

  if (invoice.status === "cancelled") return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any[] = [
    prisma.invoice.update({
      where: { id },
      data: { status: "cancelled" },
    }),
  ];

  if (invoice.status === "issued" || invoice.status === "paid") {
    updates.push(
      prisma.customer.update({
        where: { id: invoice.customerId },
        data: { balance: { decrement: invoice.totalAmount } },
      })
    );
  }

  await prisma.$transaction(updates);

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/customers");
}

export async function addPaymentToInvoice(invoiceId: string, formData: FormData) {
  const amount = parseFloat(formData.get("amount") as string);
  const method = (formData.get("method") as string) || "cash";
  const reference = (formData.get("reference") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!amount || amount <= 0) return;

  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
  });

  const newPaid = invoice.paidAmount + amount;
  const newStatus = newPaid >= invoice.totalAmount ? "paid" : invoice.status;

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        amount,
        method,
        reference,
        notes,
        customerId: invoice.customerId,
        invoiceId,
      },
    }),
    prisma.invoice.update({
      where: { id: invoiceId },
      data: { paidAmount: { increment: amount }, status: newStatus },
    }),
    prisma.customer.update({
      where: { id: invoice.customerId },
      data: { balance: { decrement: amount } }, // دفعة تقلل المديونية
    }),
  ]);

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/customers");
}

export async function deleteInvoice(id: string) {
  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id },
  });

  if (invoice.status !== "draft") return;

  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/invoices");
}
