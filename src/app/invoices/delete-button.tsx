"use client";

import { deleteInvoice } from "./actions";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export function DeleteInvoiceButton({ id }: { id: string }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={async () => {
        if (confirm(t("inv.confirmDelete"))) {
          try {
            await deleteInvoice(id);
            toast.success(t("toast.deleted"));
          } catch {
            toast.error(t("toast.error"));
          }
        }
      }}
      className="text-danger hover:opacity-70 text-sm transition-opacity"
    >
      {t("common.delete")}
    </button>
  );
}
