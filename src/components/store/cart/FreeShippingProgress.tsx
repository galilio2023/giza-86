import { Truck } from "lucide-react";
import { formatEGP } from "@/lib/utils";

export interface FreeShippingProgressProps {
  subtotal: number;
  threshold: number;
  className?: string;
  variant?: "default" | "drawer";
}

export function FreeShippingProgress({
  subtotal,
  threshold,
  className = "",
  variant = "default",
}: FreeShippingProgressProps) {
  const safeThreshold = threshold > 0 ? threshold : 1200;
  const progressPercent = Math.min(100, Math.round((subtotal / safeThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, safeThreshold - subtotal);

  const isDrawer = variant === "drawer";

  return (
    <div
      className={
        className ||
        (isDrawer
          ? "p-3.5 bg-neutral-50 border-b border-neutral-200/80"
          : "p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80")
      }
    >
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-900 mb-2">
        <span className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
          {remainingForFreeShipping > 0 ? (
            <span>
              أضف منتجات بقيمة{" "}
              <strong className="text-neutral-950 font-black">
                {formatEGP(remainingForFreeShipping)}
              </strong>{" "}
              إضافية للحصول على شحن مجاني لكافة محافظات مصر! 🚚
            </span>
          ) : (
            <strong className="text-emerald-700 font-bold">
              🎉 تهانينا! مؤهل لشحن مجاني سريع لكافة محافظات مصر
            </strong>
          )}
        </span>
        <span className="text-xs font-black text-neutral-900 font-mono">{progressPercent}%</span>
      </div>
      <div className={`w-full bg-neutral-200/80 rounded-full ${isDrawer ? "h-2" : "h-2.5"} overflow-hidden`}>
        <div
          className={`bg-neutral-950 ${isDrawer ? "h-2" : "h-2.5"} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
