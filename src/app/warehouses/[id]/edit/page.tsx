import { cookies } from "next/headers";
import { getWarehouse, updateWarehouse } from "../../actions";
import { FormPageWrapper } from "@/components/ui";
import { notFound } from "next/navigation";
import { type Locale, t } from "@/lib/i18n";

export default async function EditWarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const warehouse = await getWarehouse(id);

  if (!warehouse) notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";
  const updateWarehouseWithId = updateWarehouse.bind(null, id);

  return (
    <FormPageWrapper title={t(locale, "wh.editWarehouse")} backHref="/warehouses" backLabel={t(locale, "wh.backToList")}>
      <form action={updateWarehouseWithId} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t(locale, "wh.warehouseName")} *</label>
          <input type="text" id="name" name="name" required defaultValue={warehouse.name} className="input-field" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">{t(locale, "wh.location")}</label>
          <input type="text" id="location" name="location" defaultValue={warehouse.location || ""} className="input-field" />
        </div>
        <button type="submit" className="btn-primary">{t(locale, "wh.updateWarehouse")}</button>
      </form>
    </FormPageWrapper>
  );
}
