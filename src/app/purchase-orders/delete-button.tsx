"use client";

import { deletePurchaseOrder } from "./actions";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export function DeletePOButton({ id }: { id: string }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={async () => {
        if (confirm(t("po.confirmDelete"))) {
          try {
            await deletePurchaseOrder(id);
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
