"use client";

import Link from "next/link";
import { PageHeader, EmptyState, AnimatedTable, TableRow } from "@/components/ui";
import { DeleteWarehouseButton } from "./delete-button";
import { useLanguage } from "@/lib/language-context";

type Warehouse = {
  id: string;
  name: string;
  location: string | null;
  createdAt: Date;
};

export function WarehousesClient({ warehouses }: { warehouses: Warehouse[] }) {
  const { t, dateLocale } = useLanguage();
  return (
    <div>
      <PageHeader
        title={t("wh.title")}
        action={
          <Link href="/warehouses/new" className="btn-primary text-sm">
            {t("wh.addBtn")}
          </Link>
        }
      />

      {warehouses.length === 0 ? (
        <EmptyState message={t("wh.noWarehouses")} hint={t("wh.noWarehousesHint")} />
      ) : (
        <AnimatedTable headers={[t("wh.th_name"), t("wh.th_location"), t("wh.th_createdAt"), t("wh.th_actions")]}>
          {warehouses.map((wh, i) => (
            <TableRow key={wh.id} index={i}>
              <td className="font-medium">{wh.name}</td>
              <td>{wh.location || "—"}</td>
              <td className="text-sm text-muted">
                {new Date(wh.createdAt).toLocaleDateString(dateLocale)}
              </td>
              <td>
                <div className="flex gap-3">
                  <Link href={`/warehouses/${wh.id}/edit`} className="text-accent hover:text-accent-hover text-sm transition-colors">
                    {t("common.edit")}
                  </Link>
                  <DeleteWarehouseButton id={wh.id} />
                </div>
              </td>
            </TableRow>
          ))}
        </AnimatedTable>
      )}
    </div>
  );
}
