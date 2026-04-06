"use client";

import Link from "next/link";
import { PageHeader, EmptyState, AnimatedTable, TableRow } from "@/components/ui";
import { DeleteSupplierButton } from "./delete-button";
import { useLanguage } from "@/lib/language-context";

type Supplier = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  taxExempt: boolean;
  balance: number;
};

export function SuppliersClient({ suppliers }: { suppliers: Supplier[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader
        title={t("sup.title")}
        action={
          <Link href="/suppliers/new" className="btn-primary text-sm">
            {t("sup.addBtn")}
          </Link>
        }
      />

      {suppliers.length === 0 ? (
        <EmptyState message={t("sup.noSuppliers")} hint={t("sup.noSuppliersHint")} />
      ) : (
        <AnimatedTable headers={[t("sup.th_name"), t("sup.th_phone"), t("sup.th_email"), t("sup.th_balance"), t("sup.th_exempt"), t("sup.th_actions")]}>
          {suppliers.map((s, i) => (
            <TableRow key={s.id} index={i}>
              <td className="font-medium">{s.name}</td>
              <td className="font-mono text-xs text-muted">{s.phone || "—"}</td>
              <td className="text-sm text-muted">{s.email || "—"}</td>
              <td>
                <span className={`font-mono ${s.balance > 0 ? "text-danger" : s.balance < 0 ? "text-success" : "text-muted"}`}>
                  {s.balance.toFixed(2)}
                </span>
              </td>
              <td>{s.taxExempt ? <span className="text-accent">✓</span> : "—"}</td>
              <td>
                <div className="flex gap-3">
                  <Link href={`/suppliers/${s.id}/edit`} className="text-accent hover:text-accent-hover text-sm transition-colors">
                    {t("common.edit")}
                  </Link>
                  <DeleteSupplierButton id={s.id} />
                </div>
              </td>
            </TableRow>
          ))}
        </AnimatedTable>
      )}
    </div>
  );
}
