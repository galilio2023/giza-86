import { formatEGP } from "@/lib/utils";
import { getDiscountPercentage } from "@/lib/domain/pricing";

export interface PriceTagProps {
  price: number;
  salePrice?: number | null;
  size?: "sm" | "md" | "lg";
  showDiscountBadge?: boolean;
  className?: string;
}

export function PriceTag({
  price,
  salePrice,
  size = "md",
  showDiscountBadge = false,
  className = "",
}: PriceTagProps) {
  const hasDiscount = Boolean(
    salePrice !== undefined &&
    salePrice !== null &&
    !isNaN(Number(salePrice)) &&
    Number(salePrice) > 0 &&
    Number(salePrice) < price
  );

  const effectivePrice = hasDiscount ? Number(salePrice) : price;
  const originalPrice = price;
  const discountPercent = hasDiscount ? getDiscountPercentage(originalPrice, effectivePrice) : 0;

  const currentPriceSizeClasses = {
    sm: "text-xs sm:text-sm font-black text-neutral-900",
    md: "text-xs sm:text-base md:text-lg font-black text-neutral-900",
    lg: "text-lg sm:text-2xl md:text-3xl font-black text-neutral-900",
  }[size];

  const originalPriceSizeClasses = {
    sm: "text-[10px] text-neutral-400 line-through",
    md: "text-[10px] sm:text-xs text-neutral-400 line-through",
    lg: "text-sm sm:text-base text-neutral-400 line-through",
  }[size];

  return (
    <div className={`flex items-baseline gap-1 sm:gap-2 flex-wrap ${className}`}>
      <span className={`${currentPriceSizeClasses} whitespace-nowrap`}>
        {formatEGP(effectivePrice)}
      </span>

      {hasDiscount && (
        <span className={`${originalPriceSizeClasses} whitespace-nowrap`}>
          {formatEGP(originalPrice)}
        </span>
      )}

      {hasDiscount && showDiscountBadge && discountPercent > 0 && (
        <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
          خصم {discountPercent}%
        </span>
      )}
    </div>
  );
}
