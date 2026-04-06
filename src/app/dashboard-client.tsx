"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  StaggerContainer,
  StaggerItem,
  HoverCard,
  AnimatedButton,
  CountUpNumber,
} from "@/components/animations";
import { useLanguage } from "@/lib/language-context";

type DashboardStats = {
  itemsCount: number;
  warehousesCount: number;
  suppliersCount: number;
  customersCount: number;
  totalPurchases: number;
  totalSales: number;
  pendingPurchases: number;
  pendingInvoices: number;
  activePO: number;
  activeInv: number;
  poCount: number;
  invCount: number;
};

const moduleDefs = [
  { href: "/items", titleKey: "nav.items", descKey: "dash.items_desc", statKey: "itemsCount" as const, icon: "📦", gradient: "from-indigo-500 to-indigo-600" },
  { href: "/warehouses", titleKey: "nav.warehouses", descKey: "dash.warehouses_desc", statKey: "warehousesCount" as const, icon: "🏪", gradient: "from-slate-500 to-slate-600" },
  { href: "/suppliers", titleKey: "nav.suppliers", descKey: "dash.suppliers_desc", statKey: "suppliersCount" as const, icon: "🚚", gradient: "from-violet-500 to-violet-600" },
  { href: "/customers", titleKey: "nav.customers", descKey: "dash.customers_desc", statKey: "customersCount" as const, icon: "👥", gradient: "from-blue-500 to-blue-600" },
  { href: "/purchase-orders", titleKey: "nav.purchaseOrders", descKey: "dash.po_desc", statKey: "poCount" as const, icon: "📋", gradient: "from-emerald-500 to-emerald-600" },
  { href: "/invoices", titleKey: "inv.title", descKey: "dash.invoices_desc", statKey: "invCount" as const, icon: "🧾", gradient: "from-amber-500 to-amber-600" },
  { href: "/tax-settings", titleKey: "nav.taxSettings", descKey: "dash.tax_desc", statKey: null, icon: "⚙️", gradient: "from-rose-500 to-rose-600" },
];

export function DashboardClient({ stats }: { stats: DashboardStats }) {
  const { t } = useLanguage();
  const netBalance = stats.totalSales - stats.totalPurchases;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">{t("dash.title")}</h1>
        <p className="text-muted mt-1">{t("dash.subtitle")}</p>
      </motion.div>

      {/* Hero KPI Row */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Total Sales */}
        <StaggerItem>
          <div className="stat-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-t-xl" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xl">💰</div>
              <p className="text-sm font-medium text-muted">{t("dash.totalSales")}</p>
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              <CountUpNumber value={stats.totalSales} />
            </p>
            <p className="text-xs text-muted mt-1.5">{stats.invCount} {t("dash.invoice")} &middot; {stats.activeInv} {t("dash.active")}</p>
          </div>
        </StaggerItem>

        {/* Total Purchases */}
        <StaggerItem>
          <div className="stat-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-indigo-400 to-indigo-600 rounded-t-xl" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xl">🛒</div>
              <p className="text-sm font-medium text-muted">{t("dash.totalPurchases")}</p>
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              <CountUpNumber value={stats.totalPurchases} />
            </p>
            <p className="text-xs text-muted mt-1.5">{stats.poCount} {t("dash.order")} &middot; {stats.activePO} {t("dash.activeOrder")}</p>
          </div>
        </StaggerItem>

        {/* Customer Debts */}
        <StaggerItem>
          <div className="stat-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-amber-400 to-amber-600 rounded-t-xl" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">📊</div>
              <p className="text-sm font-medium text-muted">{t("dash.customerDebts")}</p>
            </div>
            <p className={`text-2xl font-bold font-mono ${stats.pendingInvoices > 0 ? "text-danger" : "text-success"}`}>
              <CountUpNumber value={stats.pendingInvoices} />
            </p>
            <p className="text-xs text-muted mt-1.5">{stats.activeInv} {t("dash.pendingInvoice")}</p>
          </div>
        </StaggerItem>

        {/* Supplier Dues */}
        <StaggerItem>
          <div className="stat-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-rose-400 to-rose-600 rounded-t-xl" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-xl">📑</div>
              <p className="text-sm font-medium text-muted">{t("dash.supplierDues")}</p>
            </div>
            <p className={`text-2xl font-bold font-mono ${stats.pendingPurchases > 0 ? "text-danger" : "text-success"}`}>
              <CountUpNumber value={stats.pendingPurchases} />
            </p>
            <p className="text-xs text-muted mt-1.5">{stats.activePO} {t("dash.pendingOrder")}</p>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Summary Row */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StaggerItem>
          <div className="stat-card text-center">
            <p className="text-sm font-medium text-muted mb-1">{t("dash.customersCount")}</p>
            <p className="text-3xl font-bold text-accent font-mono">
              <CountUpNumber value={stats.customersCount} decimals={0} />
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="stat-card text-center">
            <p className="text-sm font-medium text-muted mb-1">{t("dash.itemsCount")}</p>
            <p className="text-3xl font-bold text-accent font-mono">
              <CountUpNumber value={stats.itemsCount} decimals={0} />
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="stat-card text-center">
            <p className="text-sm font-medium text-muted mb-1">{t("dash.netProfit")}</p>
            <p className={`text-3xl font-bold font-mono ${netBalance >= 0 ? "text-success" : "text-danger"}`}>
              <CountUpNumber value={netBalance} />
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex flex-wrap gap-3 mb-10"
      >
        <Link href="/invoices/new">
          <AnimatedButton className="btn-primary flex items-center gap-2 text-sm">
            <span>🧾</span> {t("dash.newInvoice")}
          </AnimatedButton>
        </Link>
        <Link href="/purchase-orders/new">
          <AnimatedButton className="btn-primary flex items-center gap-2 text-sm">
            <span>📋</span> {t("dash.newPO")}
          </AnimatedButton>
        </Link>
        <Link href="/items/new">
          <AnimatedButton className="btn-primary flex items-center gap-2 text-sm">
            <span>📦</span> {t("dash.newItem")}
          </AnimatedButton>
        </Link>
        <Link href="/customers/new">
          <AnimatedButton className="btn-primary flex items-center gap-2 text-sm">
            <span>👤</span> {t("dash.newCustomer")}
          </AnimatedButton>
        </Link>
      </motion.div>

      {/* Module Cards */}
      <h2 className="text-lg font-semibold text-foreground mb-4">{t("dash.sections")}</h2>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {moduleDefs.map((mod) => (
          <StaggerItem key={mod.href}>
            <Link href={mod.href}>
              <HoverCard className="stat-card group cursor-pointer h-full">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.gradient} flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {mod.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-0.5">{t(mod.titleKey)}</h3>
                <p className="text-xs text-muted">{t(mod.descKey)}</p>
                {mod.statKey && (
                  <p className="text-lg font-bold text-accent mt-2 font-mono">
                    {stats[mod.statKey]}
                  </p>
                )}
              </HoverCard>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
