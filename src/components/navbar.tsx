"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";
import { useEffect, useState } from "react";
import { logout } from "@/app/login/actions";

const navLinks = [
  { href: "/", key: "nav.dashboard", icon: "⊞" },
  { href: "/items", key: "nav.items", icon: "▦" },
  { href: "/warehouses", key: "nav.warehouses", icon: "⊟" },
  { href: "/suppliers", key: "nav.suppliers", icon: "⇄" },
  { href: "/customers", key: "nav.customers", icon: "◉" },
  { href: "/purchase-orders", key: "nav.purchaseOrders", icon: "▤" },
  { href: "/invoices", key: "nav.invoices", icon: "▧" },
  { href: "/tax-settings", key: "nav.taxSettings", icon: "⚙" },
];

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-header-border bg-header-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
            {t("nav.logo")}
          </div>
          <span className="text-lg font-bold text-foreground">{t("nav.systemName")}</span>
        </Link>

        <nav className="flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-sidebar-text hover:text-sidebar-text-hover hover:bg-accent-light transition-all duration-200"
            >
              <span className="text-xs opacity-60">{link.icon}</span>
              {t(link.key)}
            </Link>
          ))}

          {/* Ctrl+K hint */}
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            className="ms-2 px-2.5 py-1.5 rounded-lg text-xs border border-card-border hover:bg-accent-light transition-all duration-200 text-muted font-mono"
            title="Ctrl+K"
          >
            ⌘K
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="ms-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-card-border hover:bg-accent-light transition-all duration-200 text-sidebar-text hover:text-sidebar-text-hover"
            title={locale === "ar" ? "English" : "عربي"}
          >
            {locale === "ar" ? "EN" : "عربي"}
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ms-1 px-3 py-1.5 rounded-lg text-sm border border-card-border hover:bg-accent-light transition-all duration-200"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              className="ms-1 px-3 py-1.5 rounded-lg text-sm text-danger hover:bg-danger/10 border border-card-border transition-all duration-200"
              title={t("auth.logout")}
            >
              {t("auth.logout")}
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
