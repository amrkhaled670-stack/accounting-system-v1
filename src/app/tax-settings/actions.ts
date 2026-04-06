"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTaxSettings() {
  return prisma.taxSetting.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateTaxRate(formData: FormData) {
  const rate = parseFloat(formData.get("rate") as string);

  if (isNaN(rate) || rate < 0 || rate > 100) return;

  // Update existing active setting or create one
  const existing = await prisma.taxSetting.findFirst({ where: { isActive: true } });

  if (existing) {
    await prisma.taxSetting.update({
      where: { id: existing.id },
      data: { rate },
    });
  } else {
    await prisma.taxSetting.create({
      data: { rate, isActive: true },
    });
  }

  revalidatePath("/tax-settings");
}
