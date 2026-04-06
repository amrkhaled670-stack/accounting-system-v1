"use client";

import { useState } from "react";
import {
  confirmPurchaseOrder,
  cancelPurchaseOrder,
  addPaymentToPurchaseOrder,
} from "../actions";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export function POActions({
  orderId,
  status,
  remaining,
}: {
  orderId: string;
  status: string;
  remaining: number;
}) {
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="border-t border-border pt-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{t("common.actions")}</h2>

      <div className="flex gap-3 flex-wrap">
        {status === "draft" && (
          <button
            onClick={async () => {
              if (confirm(t("po.confirmOrderMsg"))) {
                try {
                  await confirmPurchaseOrder(orderId);
                  toast.success(t("toast.confirmed"));
                } catch {
                  toast.error(t("toast.error"));
                }
              }
            }}
            className="btn-primary text-sm"
          >
            {t("po.confirmOrder")}
          </button>
        )}

        {(status === "draft" || status === "confirmed") && (
          <button
            onClick={async () => {
              if (confirm(t("po.cancelOrderMsg"))) {
                try {
                  await cancelPurchaseOrder(orderId);
                  toast.success(t("toast.cancelled"));
                } catch {
                  toast.error(t("toast.error"));
                }
              }
            }}
            className="btn-danger text-sm"
          >
            {t("po.cancelOrder")}
          </button>
        )}

        {status !== "draft" && status !== "cancelled" && remaining > 0 && (
          <button
            onClick={() => setShowPayment(!showPayment)}
            className="bg-success text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm"
          >
            {showPayment ? t("po.hidePaymentForm") : t("po.registerPayment")}
          </button>
        )}
      </div>

      {showPayment && (
        <form
          action={addPaymentToPurchaseOrder.bind(null, orderId)}
          className="max-w-md border border-border rounded-xl p-4 space-y-3 bg-card"
        >
          <h3 className="font-semibold text-sm">{t("po.newPayment")}</h3>
          <div>
            <label htmlFor="amount" className="block text-xs mb-1">{t("common.amount")} *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0.01"
              max={remaining}
              required
              defaultValue={remaining}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor="method" className="block text-xs mb-1">{t("common.paymentMethod")}</label>
            <select
              id="method"
              name="method"
              className="input-field text-sm"
            >
              <option value="cash">{t("common.cash")}</option>
              <option value="bank_transfer">{t("common.bankTransfer")}</option>
              <option value="check">{t("common.check")}</option>
            </select>
          </div>
          <div>
            <label htmlFor="reference" className="block text-xs mb-1">{t("common.reference")}</label>
            <input
              type="text"
              id="reference"
              name="reference"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-xs mb-1">{t("common.notes")}</label>
            <input
              type="text"
              id="notes"
              name="notes"
              className="input-field text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-success text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm"
          >
            {t("po.savePayment")}
          </button>
        </form>
      )}
    </div>
  );
}
