"use server";

import { prisma } from "@/lib/db";

export async function getDebtData() {
  const [customerInvoices, supplierOrders, customers, suppliers] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        status: { in: ["issued", "paid"] },
      },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.purchaseOrder.findMany({
      where: {
        status: { in: ["confirmed", "received"] },
      },
      include: { supplier: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { balance: { not: 0 } },
      orderBy: { balance: "desc" },
    }),
    prisma.supplier.findMany({
      where: { balance: { not: 0 } },
      orderBy: { balance: "asc" },
    }),
  ]);

  const totalOwedToUs = customers.reduce((sum, c) => sum + Math.max(0, c.balance), 0);
  const totalWeOwe = suppliers.reduce((sum, s) => sum + Math.abs(Math.min(0, s.balance)), 0);

  const customerDebts = customerInvoices.map((inv) => ({
    id: inv.id,
    entityName: inv.customer.name,
    entityId: inv.customerId,
    documentNumber: inv.invoiceNumber,
    documentType: "invoice" as const,
    totalAmount: inv.totalAmount,
    paidAmount: inv.paidAmount,
    remaining: inv.totalAmount - inv.paidAmount,
    status: inv.status,
    createdAt: inv.createdAt,
  }));

  const supplierDebts = supplierOrders.map((po) => ({
    id: po.id,
    entityName: po.supplier.name,
    entityId: po.supplierId,
    documentNumber: po.orderNumber,
    documentType: "purchase_order" as const,
    totalAmount: po.totalAmount,
    paidAmount: po.paidAmount,
    remaining: po.totalAmount - po.paidAmount,
    status: po.status,
    createdAt: po.createdAt,
  }));

  const customerBalances = customers.map((c) => ({
    id: c.id,
    name: c.name,
    balance: c.balance,
  }));

  const supplierBalances = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    balance: s.balance,
  }));

  const overdueCustomer = customerDebts.filter((d) => d.remaining > 0).length;
  const overdueSupplier = supplierDebts.filter((d) => d.remaining > 0).length;

  return {
    customerDebts,
    supplierDebts,
    customerBalances,
    supplierBalances,
    totalOwedToUs,
    totalWeOwe,
    netPosition: totalOwedToUs - totalWeOwe,
    overdueCount: overdueCustomer + overdueSupplier,
  };
}
