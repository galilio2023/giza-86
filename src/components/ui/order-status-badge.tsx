import React from "react";
import { OrderItem } from "@/types";
import { ORDER_STATUSES } from "@/lib/egypt-constants";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderItem["orderStatus"] | string;
  className?: string;
  showDot?: boolean;
}

const FALLBACK_STATUS = {
  label: "غير محدد",
  color: "text-neutral-700",
  bg: "bg-neutral-100 border-neutral-200",
};

/** Displays colored status pill with indicator dot for order fulfillment milestones. */
export function OrderStatusBadge({
  status,
  className,
  showDot = true,
}: OrderStatusBadgeProps) {
  const meta = ORDER_STATUSES[status] || FALLBACK_STATUS;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
        meta.bg,
        meta.color,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "delivered"
              ? "bg-emerald-500"
              : status === "cancelled" || status === "returned"
              ? "bg-rose-500"
              : status === "shipped"
              ? "bg-purple-500"
              : status === "processing"
              ? "bg-amber-500"
              : "bg-blue-500"
          )}
        />
      )}
      <span>{meta.label}</span>
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: OrderItem["paymentStatus"] | string;
  className?: string;
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  paid: {
    label: "تم الدفع",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  failed: {
    label: "فشل الدفع",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
  pending: {
    label: "قيد الانتظار",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
};

/** Displays payment status badge for pending, paid, and failed order settlements. */
export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const meta = PAYMENT_STATUS_MAP[status] || PAYMENT_STATUS_MAP.pending;

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
