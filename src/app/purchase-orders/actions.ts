"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVatRate, calculateTax, calculateLineTotal } from "@/lib/tax";
import { generateOrderNumber } from "@/lib/numbering";

export async function getPurchaseOrders() {
  return prisma.purchaseOrder.findMany({
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPurchaseOrder(id: string) {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: { include: { item: true } },
      payments: true,
    },
  });
}

export type PurchaseOrderLineInput = {
  itemId: string;
  quantity: number;
  unitPrice: number;
};

export async function createPurchaseOrder(data: {
  supplierId: string;
  taxExempt: boolean;
  notes: string;
  lines: PurchaseOrderLineInput[];
}) {
  const vatRate = await getVatRate();
  const supplier = await prisma.supplier.findUniqueOrThrow({
    where: { id: data.supplierId },
  });

  let subtotal = 0;
  let totalTax = 0;

  // بناء بنود الطلب مع حساب الضرائب
  const itemIds = data.lines.map((l) => l.itemId);
  const items = await prisma.item.findMany({ where: { id: { in: itemIds } } });
  const itemMap = new Map(items.map((i) => [i.id, i]));

  const orderItems = data.lines.map((line) => {
    const item = itemMap.get(line.itemId);
    const tax = calculateTax({
      amount: line.quantity * line.unitPrice,
      vatRate,
      entityTaxExempt: supplier.taxExempt,
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

  const orderNumber = await generateOrderNumber();

  await prisma.purchaseOrder.create({
    data: {
      orderNumber,
      supplierId: data.supplierId,
      taxExempt: data.taxExempt,
      notes: data.notes || null,
      subtotal,
      taxAmount: totalTax,
      totalAmount: subtotal + totalTax,
      items: { create: orderItems },
    },
  });

  revalidatePath("/purchase-orders");
  redirect("/purchase-orders");
}

export async function confirmPurchaseOrder(id: string) {
  const order = await prisma.purchaseOrder.findUniqueOrThrow({
    where: { id },
    include: { supplier: true },
  });

  if (order.status !== "draft") return;

  // تحديث حالة الطلب + تحديث رصيد المورد (زيادة المديونية)
  await prisma.$transaction([
    prisma.purchaseOrder.update({
      where: { id },
      data: { status: "confirmed" },
    }),
    prisma.supplier.update({
      where: { id: order.supplierId },
      data: { balance: { decrement: order.totalAmount } }, // سالب = نحن مدينين
    }),
  ]);

  revalidatePath(`/purchase-orders/${id}`);
  revalidatePath("/purchase-orders");
  revalidatePath("/suppliers");
}

export async function cancelPurchaseOrder(id: string) {
  const order = await prisma.purchaseOrder.findUniqueOrThrow({
    where: { id },
  });

  if (order.status === "cancelled") return;

  // لو كان مؤكد، نرجع المديونية
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any[] = [
    prisma.purchaseOrder.update({
      where: { id },
      data: { status: "cancelled" },
    }),
  ];

  if (order.status === "confirmed" || order.status === "received") {
    updates.push(
      prisma.supplier.update({
        where: { id: order.supplierId },
        data: { balance: { increment: order.totalAmount } },
      })
    );
  }

  await prisma.$transaction(updates);

  revalidatePath(`/purchase-orders/${id}`);
  revalidatePath("/purchase-orders");
  revalidatePath("/suppliers");
}

export async function addPaymentToPurchaseOrder(
  orderId: string,
  formData: FormData
) {
  const amount = parseFloat(formData.get("amount") as string);
  const method = (formData.get("method") as string) || "cash";
  const reference = (formData.get("reference") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!amount || amount <= 0) return;

  const order = await prisma.purchaseOrder.findUniqueOrThrow({
    where: { id: orderId },
  });

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        amount,
        method,
        reference,
        notes,
        supplierId: order.supplierId,
        purchaseOrderId: orderId,
      },
    }),
    prisma.purchaseOrder.update({
      where: { id: orderId },
      data: { paidAmount: { increment: amount } },
    }),
    prisma.supplier.update({
      where: { id: order.supplierId },
      data: { balance: { increment: amount } }, // دفع يرفع الرصيد
    }),
  ]);

  revalidatePath(`/purchase-orders/${orderId}`);
  revalidatePath("/suppliers");
}

export async function deletePurchaseOrder(id: string) {
  const order = await prisma.purchaseOrder.findUniqueOrThrow({
    where: { id },
  });

  if (order.status !== "draft") return;

  await prisma.purchaseOrder.delete({ where: { id } });
  revalidatePath("/purchase-orders");
}
