"use client";

import { useState } from "react";
import { createPurchaseOrder, type PurchaseOrderLineInput } from "../actions";
import { useLanguage } from "@/lib/language-context";

type SupplierOption = { id: string; name: string; taxExempt: boolean };
type ItemOption = { id: string; name: string; sku: string; buyPrice: number; taxExempt: boolean };

type LineItem = PurchaseOrderLineInput & { key: number };

export function PurchaseOrderForm({
  suppliers,
  items,
}: {
  suppliers: SupplierOption[];
  items: ItemOption[];
}) {
  const { t } = useLanguage();
  const [supplierId, setSupplierId] = useState("");
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

  function updateLine(key: number, field: keyof PurchaseOrderLineInput, value: string | number) {
    setLines(
      lines.map((l) => {
        if (l.key !== key) return l;
        if (field === "itemId") {
          const item = items.find((i) => i.id === value);
          return { ...l, itemId: value as string, unitPrice: item?.buyPrice ?? 0 };
        }
        return { ...l, [field]: Number(value) };
      })
    );
  }

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  async function handleSubmit() {
    if (!supplierId || lines.some((l) => !l.itemId || l.quantity <= 0)) return;
    setSubmitting(true);
    await createPurchaseOrder({
      supplierId,
      taxExempt,
      notes,
      lines: lines.map(({ itemId, quantity, unitPrice }) => ({ itemId, quantity, unitPrice })),
    });
  }

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <label htmlFor="supplier" className="block text-sm font-medium mb-1">
          {t("po.supplierField")} *
        </label>
        <select
          id="supplier"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="input-field"
        >
          <option value="">{t("po.chooseSupplier")}</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.taxExempt ? t("common.taxExemptMark") : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">{t("po.orderItems")}</h2>
        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={line.key} className="flex gap-3 items-end">
              <div className="flex-1">
                {idx === 0 && <label className="block text-xs mb-1">{t("po.itemLabel")}</label>}
                <select
                  value={line.itemId}
                  onChange={(e) => updateLine(line.key, "itemId", e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">{t("po.chooseItem")}</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                {idx === 0 && <label className="block text-xs mb-1">{t("po.quantityLabel")}</label>}
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
                {idx === 0 && <label className="block text-xs mb-1">{t("po.unitPriceLabel")}</label>}
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
                {idx === 0 && <label className="block text-xs mb-1">{t("po.lineTotalLabel")}</label>}
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
          {t("po.addItem")}
        </button>
      </div>

      <div className="border-t border-border pt-4 max-w-md">
        <div className="flex justify-between text-sm mb-1">
          <span>{t("po.subtotalLabel")}</span>
          <span className="font-mono">{subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted mb-3">
          {t("po.taxNote")}
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
            {t("po.manualTaxExempt")}
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
        disabled={submitting || !supplierId || lines.some((l) => !l.itemId)}
        className="btn-primary disabled:opacity-50"
      >
        {submitting ? t("common.saving") : t("po.createOrder")}
      </button>
    </div>
  );
}
