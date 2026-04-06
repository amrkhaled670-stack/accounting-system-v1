"use client";

import { deleteSupplier } from "./actions";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export function DeleteSupplierButton({ id }: { id: string }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={async () => {
        if (confirm(t("sup.confirmDelete"))) {
          try {
            await deleteSupplier(id);
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
