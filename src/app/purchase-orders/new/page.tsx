import { cookies } from "next/headers";
import { getSuppliers } from "@/app/suppliers/actions";
import { getItems } from "@/app/items/actions";
import { PurchaseOrderForm } from "./form";
import { FormPageWrapper } from "@/components/ui";
import { type Locale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NewPurchaseOrderPage() {
  const [suppliers, items] = await Promise.all([getSuppliers(), getItems()]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <FormPageWrapper title={t(locale, "po.addNew")} backHref="/purchase-orders" backLabel={t(locale, "po.backToList")}>
      <PurchaseOrderForm
        suppliers={suppliers.map((s) => ({ id: s.id, name: s.name, taxExempt: s.taxExempt }))}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          sku: i.sku,
          buyPrice: i.buyPrice,
          taxExempt: i.taxExempt,
        }))}
      />
    </FormPageWrapper>
  );
}
