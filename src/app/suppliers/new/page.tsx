import { cookies } from "next/headers";
import { createSupplier } from "../actions";
import { FormPageWrapper } from "@/components/ui";
import { type Locale, t } from "@/lib/i18n";

export default async function NewSupplierPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <FormPageWrapper title={t(locale, "sup.addNew")} backHref="/suppliers" backLabel={t(locale, "sup.backToList")}>
      <form action={createSupplier} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.supplierName")} *</label>
          <input type="text" id="name" name="name" required className="input-field" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.phone")}</label>
          <input type="tel" id="phone" name="phone" className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.email")}</label>
          <input type="email" id="email" name="email" className="input-field" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.address")}</label>
          <textarea id="address" name="address" rows={2} className="input-field" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="taxExempt" name="taxExempt" className="w-4 h-4 accent-accent" />
          <label htmlFor="taxExempt" className="text-sm font-medium text-foreground">{t(locale, "sup.taxExempt")}</label>
        </div>
        <button type="submit" className="btn-primary">{t(locale, "sup.saveSupplier")}</button>
      </form>
    </FormPageWrapper>
  );
}
