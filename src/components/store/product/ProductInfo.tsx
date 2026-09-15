"use client";

import { Star, Sparkles } from "lucide-react";
import { ProductItem, ProductColor } from "@/types";
import { PriceTag } from "@/components/ui/price-tag";
import { StockBadge } from "@/components/ui/stock-badge";
import { isAccessoryProduct } from "@/lib/domain/variants";
import { ProductShareButton } from "./ProductShareButton";

interface ProductInfoProps {
  product: ProductItem;
  brandName: string;
  onShare?: () => void;
  rating?: {
    score: number;
    reviewsCount: number;
  };
  selectedSize?: string;
  selectedColor?: ProductColor;
}

/** Displays product identity, pricing, rating, and stock for the selected variant. */
export function ProductInfo({
  product,
  brandName,
  onShare,
  rating = { score: 4.9, reviewsCount: 48 },
  selectedSize,
  selectedColor,
}: ProductInfoProps) {
  const currentVariant = product.variants?.find(
    (v) =>
      v.size.trim().toUpperCase() === selectedSize?.trim().toUpperCase() &&
      v.colorName.trim() === selectedColor?.name.trim()
  );
  const activeStock = currentVariant !== undefined ? currentVariant.stock : product.stock;
  const currentPrice = currentVariant?.price ?? product.salePrice ?? product.price;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-800 bg-amber-500/10 px-2.5 py-1 rounded-lg">
            {product.categoryName || "تشكيلة قطن مصري"}
          </span>
          <ProductShareButton
            product={product}
            brandName={brandName}
            currentPrice={currentPrice}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-snug">
          {product.name}
        </h1>

        {/* Reviews Summary */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-neutral-700">{rating.score} / 5</span>
          <span className="text-xs text-neutral-500 font-medium">({rating.reviewsCount} تقييم عملاء موثق)</span>
        </div>
      </div>

      {/* Price Box */}
      <div className="p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200/80 flex items-center justify-between flex-wrap gap-2">
        <PriceTag
          price={product.price}
          salePrice={hasDiscount ? currentPrice : null}
          size="lg"
          showDiscountBadge
        />
        <StockBadge stock={activeStock} lowStockThreshold={3} showInStock />
      </div>

      {/* Editorial Fabric & Fit Spec Gauge */}
      {(() => {
        const isAccessory = isAccessoryProduct(product);

        return (
          <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200/60">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAccessory ? "مواصفات القطعة والجودة" : "مواصفات النسيج والقصة"}</span>
              </span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-[10px] whitespace-nowrap">
                {product.badgeText || `${brandName} AUTHENTIC`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {isAccessory ? (
                <>
                  <div className="space-y-1">
                    <span className="text-neutral-500 block font-medium">نوع المقاس:</span>
                    <span className="font-black text-neutral-950 block">
                      {product.sizes && product.sizes.length > 0
                        ? product.sizes.join("، ")
                        : "لا ينطبق"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-500 block font-medium">ضمان الجودة:</span>
                    <span className="font-black text-neutral-950 block">
                      فحص يدوي دقيق 100%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <span className="text-neutral-500 block font-medium">كثافة النسيج:</span>
                    <span className="font-black text-neutral-950 block">
                      {product.categorySlug?.includes("hoodies")
                        ? "380 GSM (ميلتون ثقيل)"
                        : product.categorySlug?.includes("shirts")
                        ? "190 GSM (كتان نقي)"
                        : "240 GSM (قطن ثقيل فاخر)"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-500 block font-medium">نوع القَصّة:</span>
                    <span className="font-black text-neutral-950 block">
                      {product.categorySlug?.includes("oversized")
                        ? "Relaxed Oversized (أوفر سايز)"
                        : "Regular Standard Fit (قصة مضبوطة)"}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Fast Dispatch / Restock Status Banner */}
            {activeStock <= 0 ? (
              <div className="pt-2 border-t border-neutral-200/60 flex items-center gap-2 text-[11px] font-bold text-amber-900 bg-amber-50/70 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                <span>الدفعة الحالية نفدت بالكامل ✨ الشحنة الجديدة قيد التجهيز بالمصنع — احجز مقاسك المفضل عبر واتساب</span>
              </div>
            ) : (
              <div className="pt-2 border-t border-neutral-200/60 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span>جاهز للشحن الفوري: توصيل خلال 24-48 ساعة مع المعاينة قبل الدفع</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Fabric / Material Details */}
      {product.fabricDetails && (
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-3 shadow-2xs">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-sm text-neutral-700">
            <h4 className="font-bold text-neutral-950">تفاصيل الخامة والمكونات:</h4>
            <p className="leading-relaxed">{product.fabricDetails}</p>
          </div>
        </div>
      )}
    </div>
  );
}
