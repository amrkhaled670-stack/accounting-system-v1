"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getItems() {
  return prisma.item.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getItem(id: string) {
  return prisma.item.findUnique({ where: { id } });
}

export async function createItem(formData: FormData) {
  await prisma.item.create({
    data: {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      description: (formData.get("description") as string) || null,
      unit: (formData.get("unit") as string) || "قطعة",
      buyPrice: parseFloat((formData.get("buyPrice") as string) || "0"),
      sellPrice: parseFloat((formData.get("sellPrice") as string) || "0"),
      taxExempt: formData.get("taxExempt") === "on",
    },
  });
  revalidatePath("/items");
  redirect("/items");
}

export async function updateItem(id: string, formData: FormData) {
  await prisma.item.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      description: (formData.get("description") as string) || null,
      unit: (formData.get("unit") as string) || "قطعة",
      buyPrice: parseFloat((formData.get("buyPrice") as string) || "0"),
      sellPrice: parseFloat((formData.get("sellPrice") as string) || "0"),
      taxExempt: formData.get("taxExempt") === "on",
    },
  });
  revalidatePath("/items");
  redirect("/items");
}

export async function deleteItem(id: string) {
  await prisma.item.delete({ where: { id } });
  revalidatePath("/items");
}
