"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Animated page header with title + action button
export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-between mb-6"
    >
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {action}
    </motion.div>
  );
}

// Animated empty state
export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-accent">∅</span>
      </div>
      <p className="text-lg text-foreground font-medium">{message}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </motion.div>
  );
}

// Animated table wrapper
export function AnimatedTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="overflow-x-auto rounded-xl border border-card-border bg-card"
    >
      <table className="table-pro">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </motion.div>
  );
}

// Table row with staggered entrance
export function TableRow({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      {children}
    </motion.tr>
  );
}

// Status badge
export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const cls =
    status === "draft" ? "badge-draft" :
    status === "confirmed" || status === "issued" ? "badge-confirmed" :
    status === "received" || status === "paid" ? "badge-paid" :
    status === "cancelled" ? "badge-cancelled" : "badge-draft";

  return <span className={`badge ${cls}`}>{label}</span>;
}

// Form page wrapper with animation
export function FormPageWrapper({
  title,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <a href={backHref} className="text-sm text-muted hover:text-accent transition-colors">
          ← {backLabel}
        </a>
      </div>
      {children}
    </motion.div>
  );
}

// Stat card for detail pages
export function DetailStatCard({
  label,
  value,
  valueClass,
  sub,
}: {
  label: string;
  value: string | ReactNode;
  valueClass?: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="stat-card"
    >
      <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">{label}</p>
      <div className={`text-xl font-bold ${valueClass || "text-foreground"}`}>{value}</div>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </motion.div>
  );
}
