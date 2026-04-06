import { cookies } from "next/headers";
import { createItem } from "../actions";
import { FormPageWrapper } from "@/components/ui";
import { type Locale, t } from "@/lib/i18n";

export default async function NewItemPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <FormPageWrapper title={t(locale, "items.addNew")} backHref="/items" backLabel={t(locale, "items.backToList")}>
      <form action={createItem} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
            {t(locale, "items.itemName")} *
          </label>
          <input type="text" id="name" name="name" required className="input-field" />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-foreground mb-1">
            {t(locale, "items.sku")} *
          </label>
          <input type="text" id="sku" name="sku" required className="input-field" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            {t(locale, "items.description")}
          </label>
          <textarea id="description" name="description" rows={3} className="input-field" />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-foreground mb-1">
            {t(locale, "items.unit")}
          </label>
          <input type="text" id="unit" name="unit" defaultValue={t(locale, "items.defaultUnit")} className="input-field" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="buyPrice" className="block text-sm font-medium text-foreground mb-1">
              {t(locale, "items.buyPrice")}
            </label>
            <input type="number" id="buyPrice" name="buyPrice" step="0.01" defaultValue="0" min="0" className="input-field" />
          </div>
          <div>
            <label htmlFor="sellPrice" className="block text-sm font-medium text-foreground mb-1">
              {t(locale, "items.sellPrice")}
            </label>
            <input type="number" id="sellPrice" name="sellPrice" step="0.01" defaultValue="0" min="0" className="input-field" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="taxExempt" name="taxExempt" className="w-4 h-4 rounded border-input-border text-accent" />
          <label htmlFor="taxExempt" className="text-sm text-foreground">
            {t(locale, "items.taxExempt")}
          </label>
        </div>

        <button type="submit" className="btn-primary">
          {t(locale, "items.saveItem")}
        </button>
      </form>
    </FormPageWrapper>
  );
}
