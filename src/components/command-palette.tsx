"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

interface CommandItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const commands: CommandItem[] = [
    // Pages
    { id: "dash", label: t("nav.dashboard"), icon: "⊞", href: "/", group: t("cmd.pages") },
    { id: "items", label: t("nav.items"), icon: "▦", href: "/items", group: t("cmd.pages") },
    { id: "wh", label: t("nav.warehouses"), icon: "⊟", href: "/warehouses", group: t("cmd.pages") },
    { id: "sup", label: t("nav.suppliers"), icon: "⇄", href: "/suppliers", group: t("cmd.pages") },
    { id: "cust", label: t("nav.customers"), icon: "◉", href: "/customers", group: t("cmd.pages") },
    { id: "po", label: t("nav.purchaseOrders"), icon: "▤", href: "/purchase-orders", group: t("cmd.pages") },
    { id: "inv", label: t("nav.invoices"), icon: "▧", href: "/invoices", group: t("cmd.pages") },
    { id: "tax", label: t("nav.taxSettings"), icon: "⚙", href: "/tax-settings", group: t("cmd.pages") },
    // Quick actions
    { id: "new-item", label: t("dash.newItem"), icon: "+", href: "/items/new", group: t("cmd.quickActions") },
    { id: "new-cust", label: t("dash.newCustomer"), icon: "+", href: "/customers/new", group: t("cmd.quickActions") },
    { id: "new-sup", label: `${t("sup.addNew")}`, icon: "+", href: "/suppliers/new", group: t("cmd.quickActions") },
    { id: "new-wh", label: `${t("wh.addNew")}`, icon: "+", href: "/warehouses/new", group: t("cmd.quickActions") },
    { id: "new-po", label: t("dash.newPO"), icon: "+", href: "/purchase-orders/new", group: t("cmd.quickActions") },
    { id: "new-inv", label: t("dash.newInvoice"), icon: "+", href: "/invoices/new", group: t("cmd.quickActions") },
  ];

  const filtered = query.trim()
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const flatFiltered = Object.values(groups).flat();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <span className="text-muted text-lg">⌘</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((prev) => Math.min(prev + 1, flatFiltered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((prev) => Math.max(prev - 1, 0));
              } else if (e.key === "Enter" && flatFiltered[selected]) {
                navigate(flatFiltered[selected].href);
              }
            }}
            placeholder={t("cmd.placeholder")}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted text-sm"
          />
          <kbd className="text-xs text-muted bg-surface px-1.5 py-0.5 rounded border border-border font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {flatFiltered.length === 0 && (
            <p className="text-sm text-muted text-center py-8">{t("cmd.noResults")}</p>
          )}

          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs text-muted font-semibold px-4 py-1.5 uppercase tracking-wider">
                {group}
              </p>
              {items.map((cmd) => {
                const globalIdx = flatFiltered.indexOf(cmd);
                return (
                  <button
                    key={cmd.id}
                    onClick={() => navigate(cmd.href)}
                    onMouseEnter={() => setSelected(globalIdx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      globalIdx === selected
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-surface"
                    }`}
                  >
                    <span className="text-base opacity-60 w-6 text-center">{cmd.icon}</span>
                    <span>{cmd.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
