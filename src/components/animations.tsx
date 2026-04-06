"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Page wrapper — fade in + slide up
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for lists/grids
export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Table row with hover scale
export function AnimatedTableRow({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.04)" }}
      className={className}
    >
      {children}
    </motion.tr>
  );
}

// Animated counter for dashboard numbers
export function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {value.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </motion.span>
  );
}

// Card with hover lift effect
export function HoverCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated button with whileHover + whileTap
export function AnimatedButton({
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(79, 70, 229, 0.25)" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

// Animated counter that counts up from 0
export function CountUpNumber({
  value,
  decimals = 2,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CountUpInner value={value} decimals={decimals} />
    </motion.span>
  );
}

// Inner counter using useMotionValue
import { useMotionValue, useTransform, animate as fmAnimate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function CountUpInner({ value, decimals }: { value: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) =>
    v.toLocaleString("ar-EG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      fmAnimate(motionVal, value, {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
    }
  }, [isInView, value, motionVal]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
