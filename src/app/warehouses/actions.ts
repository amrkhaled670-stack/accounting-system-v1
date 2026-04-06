"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getWarehouses() {
  return prisma.warehouse.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getWarehouse(id: string) {
  return prisma.warehouse.findUnique({ where: { id } });
}

export async function createWarehouse(formData: FormData) {
  await prisma.warehouse.create({
    data: {
      name: formData.get("name") as string,
      location: (formData.get("location") as string) || null,
    },
  });
  revalidatePath("/warehouses");
  redirect("/warehouses");
}

export async function updateWarehouse(id: string, formData: FormData) {
  await prisma.warehouse.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      location: (formData.get("location") as string) || null,
    },
  });
  revalidatePath("/warehouses");
  redirect("/warehouses");
}

export async function deleteWarehouse(id: string) {
  await prisma.warehouse.delete({ where: { id } });
  revalidatePath("/warehouses");
}
