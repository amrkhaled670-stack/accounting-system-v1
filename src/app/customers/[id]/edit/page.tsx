import { cookies } from "next/headers";
import { getCustomer, updateCustomer } from "../../actions";
import { FormPageWrapper } from "@/components/ui";
import { notFound } from "next/navigation";
import { type Locale, t } from "@/lib/i18n";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";
  const updateCustomerWithId = updateCustomer.bind(null, id);

  return (
    <FormPageWrapper title={t(locale, "cust.editCustomer")} backHref="/customers" backLabel={t(locale, "cust.backToList")}>
      <form action={updateCustomerWithId} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.customerName")} *</label>
          <input type="text" id="name" name="name" required defaultValue={customer.name} className="input-field" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.phone")}</label>
          <input type="tel" id="phone" name="phone" defaultValue={customer.phone || ""} className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.email")}</label>
          <input type="email" id="email" name="email" defaultValue={customer.email || ""} className="input-field" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.address")}</label>
          <textarea id="address" name="address" rows={2} defaultValue={customer.address || ""} className="input-field" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="taxExempt" name="taxExempt" defaultChecked={customer.taxExempt} className="w-4 h-4 accent-accent" />
          <label htmlFor="taxExempt" className="text-sm font-medium text-foreground">{t(locale, "cust.taxExempt")}</label>
        </div>
        <button type="submit" className="btn-primary">{t(locale, "cust.updateCustomer")}</button>
      </form>
    </FormPageWrapper>
  );
}
