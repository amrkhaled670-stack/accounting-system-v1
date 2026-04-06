"use client";

import { deleteCustomer } from "./actions";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export function DeleteCustomerButton({ id }: { id: string }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={async () => {
        if (confirm(t("cust.confirmDelete"))) {
          try {
            await deleteCustomer(id);
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
