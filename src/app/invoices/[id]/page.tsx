import { getInvoice } from "../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { InvoiceActions } from "./invoice-actions";
import { cookies } from "next/headers";
import { t, dateLocale, paymentMethodLabel, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  const statusLabels: Record<string, { label: string; css: string }> = {
    draft: { label: t(locale, "inv.draft"), css: "badge badge-draft" },
    issued: { label: t(locale, "inv.issued"), css: "badge badge-issued" },
    paid: { label: t(locale, "inv.paid"), css: "badge badge-paid" },
    cancelled: { label: t(locale, "inv.cancelled"), css: "badge badge-cancelled" },
  };

  const status = statusLabels[invoice.status] || statusLabels.draft;
  const remaining = invoice.totalAmount - invoice.paidAmount;
  const dl = dateLocale(locale);
  const arrow = locale === "ar" ? "←" : "→";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t(locale, "inv.detailTitle")} {invoice.invoiceNumber}</h1>
          <p className="text-muted text-sm mt-1">{t(locale, "inv.customerLabel")} {invoice.customer.name}</p>
        </div>
        <Link href="/invoices" className="text-accent hover:text-accent-hover text-sm">
          {arrow} {t(locale, "inv.backToList")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-muted">{t(locale, "common.status")}</p>
          <span className={`inline-block mt-1 ${status.css}`}>
            {status.label}
          </span>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted">{t(locale, "common.total")}</p>
          <p className="text-xl font-bold mt-1 font-mono">{invoice.totalAmount.toFixed(2)}</p>
          <p className="text-xs text-muted">
            {t(locale, "common.subtotal")}: {invoice.subtotal.toFixed(2)} | {t(locale, "common.tax")}: {invoice.taxAmount.toFixed(2)}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted">{t(locale, "common.paid")}</p>
          <p className="text-xl font-bold mt-1 text-success font-mono">{invoice.paidAmount.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted">{t(locale, "common.remaining")}</p>
          <p className={`text-xl font-bold mt-1 font-mono ${remaining > 0 ? "text-danger" : "text-success"}`}>
            {remaining.toFixed(2)}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3 text-foreground">{t(locale, "inv.invoiceItems")}</h2>
      <div className="overflow-x-auto mb-8 rounded-xl border border-border bg-card">
        <table className="table-pro">
          <thead>
            <tr>
              <th>{t(locale, "inv.th_item")}</th>
              <th>{t(locale, "inv.th_quantity")}</th>
              <th>{t(locale, "inv.th_unitPrice")}</th>
              <th>{t(locale, "inv.th_taxRate")}</th>
              <th>{t(locale, "inv.th_taxAmount")}</th>
              <th>{t(locale, "inv.th_lineTotal")}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((line) => (
              <tr key={line.id}>
                <td className="text-sm">{line.item.name}</td>
                <td className="text-sm">{line.quantity}</td>
                <td className="text-sm font-mono">{line.unitPrice.toFixed(2)}</td>
                <td className="text-sm">{line.taxRate}%</td>
                <td className="text-sm font-mono">{line.taxAmount.toFixed(2)}</td>
                <td className="text-sm font-mono font-semibold">{line.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoice.taxExempt && (
        <p className="text-sm text-amber-600 mb-4">{t(locale, "inv.taxExemptWarning")}</p>
      )}

      {invoice.notes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-1 text-foreground">{t(locale, "common.notes")}</h3>
          <p className="text-sm text-muted">{invoice.notes}</p>
        </div>
      )}

      {invoice.payments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-foreground">{t(locale, "inv.payments")}</h2>
          <div className="space-y-2">
            {invoice.payments.map((p) => (
              <div key={p.id} className="flex justify-between items-center border border-border rounded-lg px-4 py-3 text-sm bg-card hover:bg-surface transition-colors">
                <div>
                  <span className="font-mono font-bold">{p.amount.toFixed(2)}</span>
                  <span className="text-muted mr-3">
                    {paymentMethodLabel(locale, p.method)}
                  </span>
                  {p.reference && <span className="text-muted">({p.reference})</span>}
                </div>
                <span className="text-muted">
                  {new Date(p.createdAt).toLocaleDateString(dl)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <InvoiceActions invoiceId={invoice.id} status={invoice.status} remaining={remaining} />
    </div>
  );
}
