"use client";

import Link from "next/link";
import { PageHeader, EmptyState, AnimatedTable, TableRow, StatusBadge } from "@/components/ui";
import { DeletePOButton } from "./delete-button";
import { useLanguage } from "@/lib/language-context";

type PO = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: Date;
  supplier: { name: string };
};

export function PurchaseOrdersClient({ orders }: { orders: PO[] }) {
  const { t, dateLocale } = useLanguage();
  const statusMap: Record<string, string> = {
    draft: t("po.draft"),
    confirmed: t("po.confirmed"),
    received: t("po.received"),
    cancelled: t("po.cancelled"),
  };

  return (
    <div>
      <PageHeader
        title={t("po.title")}
        action={
          <Link href="/purchase-orders/new" className="btn-primary text-sm">
            {t("po.addBtn")}
          </Link>
        }
      />

      {orders.length === 0 ? (
        <EmptyState message={t("po.noOrders")} />
      ) : (
        <AnimatedTable headers={[t("po.th_orderNumber"), t("po.th_supplier"), t("po.th_status"), t("po.th_total"), t("po.th_paid"), t("po.th_remaining"), t("po.th_date"), t("po.th_actions")]}>
          {orders.map((order, i) => {
            const remaining = order.totalAmount - order.paidAmount;
            return (
              <TableRow key={order.id} index={i}>
                <td>
                  <Link href={`/purchase-orders/${order.id}`} className="font-mono text-accent hover:text-accent-hover text-sm transition-colors">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="font-medium">{order.supplier.name}</td>
                <td>
                  <StatusBadge status={order.status} label={statusMap[order.status] || order.status} />
                </td>
                <td className="font-mono">{order.totalAmount.toFixed(2)}</td>
                <td className="font-mono">{order.paidAmount.toFixed(2)}</td>
                <td>
                  <span className={`font-mono ${remaining > 0 ? "text-danger" : "text-success"}`}>
                    {remaining.toFixed(2)}
                  </span>
                </td>
                <td className="text-sm text-muted">
                  {new Date(order.createdAt).toLocaleDateString(dateLocale)}
                </td>
                <td>
                  <div className="flex gap-3">
                    <Link href={`/purchase-orders/${order.id}`} className="text-accent hover:text-accent-hover text-sm transition-colors">
                      {t("common.view")}
                    </Link>
                    {order.status === "draft" && <DeletePOButton id={order.id} />}
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
