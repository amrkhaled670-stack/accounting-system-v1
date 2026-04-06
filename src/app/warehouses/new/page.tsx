import { cookies } from "next/headers";
import { createWarehouse } from "../actions";
import { FormPageWrapper } from "@/components/ui";
import { type Locale, t } from "@/lib/i18n";

export default async function NewWarehousePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <FormPageWrapper title={t(locale, "wh.addNew")} backHref="/warehouses" backLabel={t(locale, "wh.backToList")}>
      <form action={createWarehouse} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t(locale, "wh.warehouseName")} *</label>
          <input type="text" id="name" name="name" required className="input-field" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">{t(locale, "wh.location")}</label>
          <input type="text" id="location" name="location" className="input-field" />
        </div>
        <button type="submit" className="btn-primary">{t(locale, "wh.saveWarehouse")}</button>
      </form>
    </FormPageWrapper>
  );
}
