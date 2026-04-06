"use client";

import { deleteItem } from "./actions";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export function DeleteItemButton({ id }: { id: string }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={async () => {
        if (confirm(t("items.confirmDelete"))) {
          try {
            await deleteItem(id);
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
