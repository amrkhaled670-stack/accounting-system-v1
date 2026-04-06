"use client";

import Link from "next/link";
import { PageHeader, EmptyState, AnimatedTable, TableRow } from "@/components/ui";
import { DeleteItemButton } from "./delete-button";
import { useLanguage } from "@/lib/language-context";

type Item = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  taxExempt: boolean;
};

export function ItemsClient({ items }: { items: Item[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader
        title={t("items.title")}
        action={
          <Link href="/items/new" className="btn-primary text-sm">
            {t("items.addBtn")}
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState message={t("items.noItems")} hint={t("items.noItemsHint")} />
      ) : (
        <AnimatedTable headers={[t("items.th_name"), t("items.th_code"), t("items.th_unit"), t("items.th_buyPrice"), t("items.th_sellPrice"), t("items.th_exempt"), t("items.th_actions")]}>
          {items.map((item, i) => (
            <TableRow key={item.id} index={i}>
              <td className="font-medium">{item.name}</td>
              <td className="font-mono text-xs text-muted">{item.sku}</td>
              <td>{item.unit}</td>
              <td className="font-mono">{item.buyPrice.toFixed(2)}</td>
              <td className="font-mono">{item.sellPrice.toFixed(2)}</td>
              <td>{item.taxExempt ? <span className="text-accent">✓</span> : "—"}</td>
              <td>
                <div className="flex gap-3">
                  <Link href={`/items/${item.id}/edit`} className="text-accent hover:text-accent-hover text-sm transition-colors">
                    {t("common.edit")}
                  </Link>
                  <DeleteItemButton id={item.id} />
                </div>
              </td>
            </TableRow>
          ))}
        </AnimatedTable>
      )}
    </div>
  );
}
