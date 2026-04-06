"use client";

import Link from "next/link";
import { PageHeader, EmptyState, AnimatedTable, TableRow } from "@/components/ui";
import { DeleteCustomerButton } from "./delete-button";
import { useLanguage } from "@/lib/language-context";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  balance: number;
  taxExempt: boolean;
};

export function CustomersClient({ customers }: { customers: Customer[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader
        title={t("cust.title")}
        action={
          <Link href="/customers/new" className="btn-primary text-sm">
            {t("cust.addBtn")}
          </Link>
        }
      />

      {customers.length === 0 ? (
        <EmptyState message={t("cust.noCustomers")} hint={t("cust.noCustomersHint")} />
      ) : (
        <AnimatedTable headers={[t("cust.th_name"), t("cust.th_phone"), t("cust.th_email"), t("cust.th_balance"), t("cust.th_vatExempt"), t("cust.th_actions")]}>
          {customers.map((c, i) => (
            <TableRow key={c.id} index={i}>
              <td className="font-medium">{c.name}</td>
              <td className="font-mono text-xs text-muted">{c.phone || "—"}</td>
              <td className="text-sm text-muted">{c.email || "—"}</td>
              <td>
                <span className={`font-mono ${c.balance > 0 ? "text-danger" : c.balance < 0 ? "text-success" : "text-muted"}`}>
                  {c.balance.toFixed(2)}
                </span>
              </td>
              <td>{c.taxExempt ? <span className="text-accent">✓ {t("common.yes")}</span> : t("common.no")}</td>
              <td>
                <div className="flex gap-3">
                  <Link href={`/customers/${c.id}/edit`} className="text-accent hover:text-accent-hover text-sm transition-colors">
                    {t("common.edit")}
                  </Link>
                  <DeleteCustomerButton id={c.id} />
                </div>
              </td>
            </TableRow>
          ))}
        </AnimatedTable>
      )}
    </div>
  );
}
