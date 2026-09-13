export interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
  showInStock?: boolean;
}

export function StockBadge({
  stock,
  lowStockThreshold = 5,
  className = "",
  showInStock = false,
}: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <span
        className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
      >
        نفد المخزون
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
