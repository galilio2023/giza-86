export interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
  showInStock?: boolean;
}

/** Displays the sold-out, low-stock, or optional in-stock status for a quantity. */
export function StockBadge({
  stock,
  lowStockThreshold = 5,
  className = "",
  showInStock = false,
}: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-950 text-amber-300 border border-amber-400/30 shadow-2xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span>نفد بالكامل ✨</span>
      </span>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <span
        className={`inline-flex items-center text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse ${className}`}
      >
        باقي {stock} قطع فقط!
      </span>
    );
  }

  if (showInStock) {
    return (
      <span
        className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        متوفر بالمخزن
      </span>
    );
  }

  return null;
}
