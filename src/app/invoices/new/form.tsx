"use client";

import { useState } from "react";
import { createInvoice, type InvoiceLineInput } from "../actions";
import { useLanguage } from "@/lib/language-context";

type CustomerOption = { id: string; name: string; taxExempt: boolean };
type ItemOption = { id: string; name: string; sku: string; sellPrice: number; taxExempt: boolean };

type LineItem = InvoiceLineInput & { key: number };

export function InvoiceForm({
  customers,
  items,
}: {
  customers: CustomerOption[];
  items: ItemOption[];
}) {
  const { t } = useLanguage();
  const [customerId, setCustomerId] = useState("");
  const [taxExempt, setTaxExempt] = useState(false);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineItem[]>([
    { key: Date.now(), itemId: "", quantity: 1, unitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  function addLine() {
    setLines([...lines, { key: Date.now(), itemId: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeLine(key: number) {
    if (lines.length <= 1) return;
    setLines(lines.filter((l) => l.key !== key));
  }

  function updateLine(key: number, field: keyof InvoiceLineInput, value: string | number) {
    setLines(
      lines.map((l) => {
        if (l.key !== key) return l;
        if (field === "itemId") {
          const item = items.find((i) => i.id === value);
          return { ...l, itemId: value as string, unitPrice: item?.sellPrice ?? 0 };
        }
        return { ...l, [field]: Number(value) };
      })
    );
  }

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  async function handleSubmit() {
    if (!customerId || lines.some((l) => !l.itemId || l.quantity <= 0)) return;
    setSubmitting(true);
    await createInvoice({
      customerId,
      taxExempt,
      notes,
      lines: lines.map(({ itemId, quantity, unitPrice }) => ({ itemId, quantity, unitPrice })),
    });
  }

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <label htmlFor="customer" className="block text-sm font-medium mb-1">
          {t("inv.customerField")} *
        </label>
        <select
          id="customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="input-field"
        >
          <option value="">{t("inv.chooseCustomer")}</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.taxExempt ? t("common.taxExemptMark") : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">{t("inv.invoiceItems")}</h2>
        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={line.key} className="flex gap-3 items-end">
              <div className="flex-1">
                {idx === 0 && <label className="block text-xs mb-1">{t("inv.itemLabel")}</label>}
                <select
                  value={line.itemId}
                  onChange={(e) => updateLine(line.key, "itemId", e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">{t("inv.chooseItem")}</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                {idx === 0 && <label className="block text-xs mb-1">{t("inv.quantityLabel")}</label>}
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) => updateLine(line.key, "quantity", e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="input-field text-sm"
                />
              </div>
              <div className="w-32">
                {idx === 0 && <label className="block text-xs mb-1">{t("inv.unitPriceLabel")}</label>}
                <input
                  type="number"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(line.key, "unitPrice", e.target.value)}
                  min="0"
                  step="0.01"
                  className="input-field text-sm"
                />
              </div>
              <div className="w-28 text-sm py-2 text-left font-mono">
                {idx === 0 && <label className="block text-xs mb-1">{t("inv.lineTotalLabel")}</label>}
                {(line.quantity * line.unitPrice).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => removeLine(line.key)}
                className="text-danger hover:opacity-70 pb-2 text-lg"
                title={t("common.delete")}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLine}
          className="mt-3 text-accent hover:text-accent-hover text-sm font-medium"
        >
          {t("inv.addItem")}
        </button>
      </div>

      <div className="border-t border-border pt-4 max-w-md">
        <div className="flex justify-between text-sm mb-1">
          <span>{t("inv.subtotalLabel")}</span>
          <span className="font-mono">{subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted mb-3">
          {t("inv.taxNote")}
        </p>
      </div>

      <div className="max-w-md space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="taxExempt"
            checked={taxExempt}
            onChange={(e) => setTaxExempt(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="taxExempt" className="text-sm text-foreground">
            {t("inv.manualTaxExempt")}
          </label>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">
            {t("common.notes")}
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="input-field"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !customerId || lines.some((l) => !l.itemId)}
        className="btn-primary disabled:opacity-50"
      >
        {submitting ? t("common.saving") : t("inv.createInvoice")}
      </button>
    </div>
  );
}
