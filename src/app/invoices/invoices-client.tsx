"use client";

import Link from "next/link";
import { PageHeader, EmptyState, AnimatedTable, TableRow, StatusBadge } from "@/components/ui";
import { DeleteInvoiceButton } from "./delete-button";
import { useLanguage } from "@/lib/language-context";

type Inv = {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: Date;
  customer: { name: string };
};

export function InvoicesClient({ invoices }: { invoices: Inv[] }) {
  const { t, dateLocale } = useLanguage();
  const statusMap: Record<string, string> = {
    draft: t("inv.draft"),
    issued: t("inv.issued"),
    paid: t("inv.paid"),
    cancelled: t("inv.cancelled"),
  };

  return (
    <div>
      <PageHeader
        title={t("inv.title")}
        action={
          <Link href="/invoices/new" className="btn-primary text-sm">
            {t("inv.addBtn")}
          </Link>
        }
      />

      {invoices.length === 0 ? (
        <EmptyState message={t("inv.noInvoices")} />
      ) : (
        <AnimatedTable headers={[t("inv.th_invoiceNumber"), t("inv.th_customer"), t("inv.th_status"), t("inv.th_total"), t("inv.th_paid"), t("inv.th_remaining"), t("inv.th_date"), t("inv.th_actions")]}>
          {invoices.map((inv, i) => {
            const remaining = inv.totalAmount - inv.paidAmount;
            return (
              <TableRow key={inv.id} index={i}>
                <td>
                  <Link href={`/invoices/${inv.id}`} className="font-mono text-accent hover:text-accent-hover text-sm transition-colors">
                    {inv.invoiceNumber}
                  </Link>
                </td>
                <td className="font-medium">{inv.customer.name}</td>
                <td>
                  <StatusBadge status={inv.status} label={statusMap[inv.status] || inv.status} />
                </td>
                <td className="font-mono">{inv.totalAmount.toFixed(2)}</td>
                <td className="font-mono">{inv.paidAmount.toFixed(2)}</td>
                <td>
                  <span className={`font-mono ${remaining > 0 ? "text-danger" : "text-success"}`}>
                    {remaining.toFixed(2)}
                  </span>
                </td>
                <td className="text-sm text-muted">
                  {new Date(inv.createdAt).toLocaleDateString(dateLocale)}
                </td>
                <td>
                  <div className="flex gap-3">
                    <Link href={`/invoices/${inv.id}`} className="text-accent hover:text-accent-hover text-sm transition-colors">
                      {t("common.view")}
                    </Link>
                    {inv.status === "draft" && <DeleteInvoiceButton id={inv.id} />}
                  </div>
                </td>
              </TableRow>
            );
          })}
        </AnimatedTable>
      )}
    </div>
  );
}
