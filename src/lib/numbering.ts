"use server";

import { prisma } from "@/lib/db";

export async function generateOrderNumber(): Promise<string> {
  const count = await prisma.purchaseOrder.count();
  return `PO-${String(count + 1).padStart(5, "0")}`;
}

export async function generateInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  return `INV-${String(count + 1).padStart(5, "0")}`;
}
