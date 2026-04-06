import { prisma } from "@/lib/db";

const DEFAULT_VAT_RATE = 14;

export async function getVatRate(): Promise<number> {
  const setting = await prisma.taxSetting.findFirst({
    where: { isActive: true },
  });
  return setting?.rate ?? DEFAULT_VAT_RATE;
}

/**
 * يحسب الضريبة بناءً على مستويات الإعفاء:
 * 1. Entity Level: لو المورد/العميل معفي → 0%
 * 2. Item Level: لو الصنف معفي → 0%
 * 3. Manual Override: لو الفاتورة/الطلب نفسه معفي يدوياً → 0%
 * 4. غير ذلك → نسبة الضريبة الافتراضية
 */
export function calculateTax(params: {
  amount: number;
  vatRate: number;
  entityTaxExempt: boolean;  // المورد أو العميل
  itemTaxExempt: boolean;    // الصنف
  manualOverride: boolean;   // تجاوز يدوي على الفاتورة
}): { taxRate: number; taxAmount: number } {
  const { amount, vatRate, entityTaxExempt, itemTaxExempt, manualOverride } = params;

  if (entityTaxExempt || itemTaxExempt || manualOverride) {
    return { taxRate: 0, taxAmount: 0 };
  }

  const taxRate = vatRate;
  const taxAmount = Math.round((amount * taxRate) / 100 * 100) / 100;
  return { taxRate, taxAmount };
}

export function calculateLineTotal(
  quantity: number,
  unitPrice: number,
  taxRate: number
): { subtotal: number; taxAmount: number; totalPrice: number } {
  const subtotal = Math.round(quantity * unitPrice * 100) / 100;
  const taxAmount = Math.round((subtotal * taxRate) / 100 * 100) / 100;
  const totalPrice = subtotal + taxAmount;
  return { subtotal, taxAmount, totalPrice };
}
