"use server";

import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const [
    itemsCount,
    warehousesCount,
    suppliersCount,
    customersCount,
    purchaseOrders,
    invoices,
  ] = await Promise.all([
    prisma.item.count(),
    prisma.warehouse.count(),
    prisma.supplier.count(),
    prisma.customer.count(),
    prisma.purchaseOrder.findMany({
      select: { status: true, totalAmount: true, paidAmount: true },
    }),
    prisma.invoice.findMany({
      select: { status: true, totalAmount: true, paidAmount: true },
    }),
  ]);

  const totalPurchases = purchaseOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalSales = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const pendingPurchases = purchaseOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.totalAmount - o.paidAmount), 0);
  const pendingInvoices = invoices
    .filter((i) => i.status !== "cancelled")
    .reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);
  const activePO = purchaseOrders.filter((o) => o.status === "confirmed" || o.status === "draft").length;
  const activeInv = invoices.filter((i) => i.status === "issued" || i.status === "draft").length;

  return {
    itemsCount,
    warehousesCount,
    suppliersCount,
    customersCount,
    totalPurchases,
    totalSales,
    pendingPurchases,
    pendingInvoices,
    activePO,
    activeInv,
    poCount: purchaseOrders.length,
    invCount: invoices.length,
  };
}
