import { cookies } from "next/headers";
import { createCustomer } from "../actions";
import { FormPageWrapper } from "@/components/ui";
import { type Locale, t } from "@/lib/i18n";

export default async function NewCustomerPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <FormPageWrapper title={t(locale, "cust.addNew")} backHref="/customers" backLabel={t(locale, "cust.backToList")}>
      <form action={createCustomer} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.customerName")} *</label>
          <input type="text" id="name" name="name" required className="input-field" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.phone")}</label>
          <input type="tel" id="phone" name="phone" className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.email")}</label>
          <input type="email" id="email" name="email" className="input-field" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">{t(locale, "cust.address")}</label>
          <textarea id="address" name="address" rows={2} className="input-field" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="taxExempt" name="taxExempt" className="w-4 h-4 accent-accent" />
          <label htmlFor="taxExempt" className="text-sm font-medium text-foreground">{t(locale, "cust.taxExempt")}</label>
        </div>
        <button type="submit" className="btn-primary">{t(locale, "cust.saveCustomer")}</button>
      </form>
    </FormPageWrapper>
  );
}
