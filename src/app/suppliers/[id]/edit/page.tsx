import { cookies } from "next/headers";
import { getSupplier, updateSupplier } from "../../actions";
import { FormPageWrapper } from "@/components/ui";
import { notFound } from "next/navigation";
import { type Locale, t } from "@/lib/i18n";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplier(id);

  if (!supplier) notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";
  const updateSupplierWithId = updateSupplier.bind(null, id);

  return (
    <FormPageWrapper title={t(locale, "sup.editSupplier")} backHref="/suppliers" backLabel={t(locale, "sup.backToList")}>
      <form action={updateSupplierWithId} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.supplierName")} *</label>
          <input type="text" id="name" name="name" required defaultValue={supplier.name} className="input-field" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.phone")}</label>
          <input type="tel" id="phone" name="phone" defaultValue={supplier.phone || ""} className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.email")}</label>
          <input type="email" id="email" name="email" defaultValue={supplier.email || ""} className="input-field" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">{t(locale, "sup.address")}</label>
          <textarea id="address" name="address" rows={2} defaultValue={supplier.address || ""} className="input-field" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="taxExempt" name="taxExempt" defaultChecked={supplier.taxExempt} className="w-4 h-4 accent-accent" />
          <label htmlFor="taxExempt" className="text-sm font-medium text-foreground">{t(locale, "sup.taxExempt")}</label>
        </div>
        <button type="submit" className="btn-primary">{t(locale, "sup.updateSupplier")}</button>
      </form>
    </FormPageWrapper>
  );
}
