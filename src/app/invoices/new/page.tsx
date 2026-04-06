import { cookies } from "next/headers";
import { getCustomers } from "@/app/customers/actions";
import { getItems } from "@/app/items/actions";
import { InvoiceForm } from "./form";
import { FormPageWrapper } from "@/components/ui";
import { type Locale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const [customers, items] = await Promise.all([getCustomers(), getItems()]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <FormPageWrapper title={t(locale, "inv.addNew")} backHref="/invoices" backLabel={t(locale, "inv.backToList")}>
      <InvoiceForm
        customers={customers.map((c) => ({ id: c.id, name: c.name, taxExempt: c.taxExempt }))}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          sku: i.sku,
          sellPrice: i.sellPrice,
          taxExempt: i.taxExempt,
        }))}
      />
    </FormPageWrapper>
  );
}
