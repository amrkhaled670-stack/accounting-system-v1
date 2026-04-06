import { getTaxSettings, updateTaxRate } from "./actions";
import { cookies } from "next/headers";
import { t, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function TaxSettingsPage() {
  const settings = await getTaxSettings();
  const activeSetting = settings.find((s) => s.isActive);
  const currentRate = activeSetting?.rate ?? 14;

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-foreground">{t(locale, "tax.title")}</h1>

      <div className="max-w-lg">
        <div className="stat-card mb-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">{t(locale, "tax.vatTitle")}</h2>
          <form action={updateTaxRate} className="space-y-4">
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-foreground mb-1">
                {t(locale, "tax.taxRateLabel")}
              </label>
              <input
                type="number"
                id="rate"
                name="rate"
                step="0.01"
                min="0"
                max="100"
                defaultValue={currentRate}
                required
                className="input-field"
              />
              <p className="text-xs text-muted mt-1">{t(locale, "tax.defaultRate")}</p>
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              {t(locale, "common.save")}
            </button>
          </form>
        </div>

        <div className="stat-card">
          <h2 className="text-lg font-semibold mb-3 text-foreground">{t(locale, "tax.exemptionLevels")}</h2>
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-start gap-2">
              <span className="text-accent font-bold">1.</span>
              <div>
                <p className="font-medium text-foreground">{t(locale, "tax.entityLevelName")}</p>
                <p>{t(locale, "tax.entityLevelDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent font-bold">2.</span>
              <div>
                <p className="font-medium text-foreground">{t(locale, "tax.itemLevelName")}</p>
                <p>{t(locale, "tax.itemLevelDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent font-bold">3.</span>
              <div>
                <p className="font-medium text-foreground">{t(locale, "tax.manualOverrideName")}</p>
                <p>{t(locale, "tax.manualOverrideDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
