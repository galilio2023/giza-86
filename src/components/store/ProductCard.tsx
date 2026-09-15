"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { ProductItem } from "@/types";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useProductVariantSelection } from "@/hooks/useProductVariantSelection";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { StockBadge } from "@/components/ui/stock-badge";
import { isAccessoryProduct } from "@/lib/domain/variants";
import { toast } from "sonner";

interface ProductCardProps {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    selectedSize,
    setSelectedSize,
    selectedColor,
    handleColorSelect,
    activeColorImage,
    currentPrice,
    isOutOfStock,
    discountPercentage,
    hasDiscount,
    isAdded,
    addToCart,
  } = useProductVariantSelection({
    product,
    addedFeedbackDuration: 1800,
  });

  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isInWishlist) {
      toast.success(`تمت إضافة "${product.name}" للمفضلة`);
    } else {
      toast.info(`تمت إزالة "${product.name}" من المفضلة`);
    }
  };

  return (
    <div
      className="group relative modern-card overflow-hidden flex flex-col w-full min-w-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full bg-neutral-100 overflow-hidden">
        <Link
          href={`/products/${product.slug || product.id}`}
          className="relative block w-full h-full"
        >
          <Image
            src={
              activeColorImage ||
              (isHovered && product.images[1]
                ? product.images[1]
                : product.images[0] || "/placeholder.jpg")
            }
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
              خصم {discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-neutral-950 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
              وصل حديثاً ✨
            </span>
          )}
        </div>

        {/* Dynamic / Egyptian Cotton Badge */}
        {(() => {
          const isAccessory = isAccessoryProduct(product);

          const effectiveBadge =
            product.badgeText !== undefined && product.badgeText !== null && product.badgeText !== ""
              ? product.badgeText
              : product.fabricDetails?.includes("قطن") || (!isAccessory && product.fabricDetails)
              ? "قطن مصري فاخر 🇪🇬"
              : undefined;

          if (!effectiveBadge) return null;

          return (
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 hidden sm:block">
              <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-neutral-200/80 shadow-xs">
                {effectiveBadge}
              </span>
            </div>
          );
        })()}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition shadow-xs cursor-pointer ${
            isInWishlist
              ? "bg-rose-50 text-rose-600"
              : "bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white"
          }`}
          aria-label="إضافة إلى المفضلة"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isInWishlist ? "fill-rose-600" : ""}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && (
          <div className="absolute inset-x-4 bottom-3 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full bg-white/95 hover:bg-white text-neutral-900 text-xs shadow-lg"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-600" />
              <span>نظرة سريعة</span>
            </Button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 min-w-0">
        <div>
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-500 font-medium mb-1">
            <span className="truncate">{product.categoryName || "تشكيلة كاجوال"}</span>
            <StockBadge stock={product.stock} lowStockThreshold={5} />
          </div>

          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-amber-600 transition min-h-[2.25rem] sm:min-h-[2.5rem] flex items-start">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Variants Preview: Colors & Sizes */}
        <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1" onClick={(e) => e.stopPropagation()}>
          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap">
                {product.colors.slice(0, 5).map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleColorSelect(c);
                    }}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                      selectedColor.hex === c.hex
                        ? "ring-2 ring-neutral-950 ring-offset-1 scale-110"
                        : "border-neutral-300 opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={`اختيار اللون ${c.name}`}
                    aria-pressed={selectedColor.hex === c.hex}
                  />
                ))}
              </div>
              <span className="hidden lg:inline text-[11px] text-neutral-500 font-semibold truncate max-w-[85px] text-left">
                {selectedColor.name}
              </span>
            </div>
          )}

          {/* Sizes Pills - strictly single row on desktop, never wraps into 2 rows */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 flex-nowrap overflow-hidden">
              {product.sizes.length === 1 && (product.sizes[0] === "مقاس موحد" || product.sizes[0] === "One Size") ? (
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {product.sizes[0]}
                </span>
              ) : (
                product.sizes.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(s);
                    }}
                    aria-label={`اختيار المقاس ${s}`}
                    aria-pressed={selectedSize === s}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold min-w-[28px] h-[28px] transition cursor-pointer flex items-center justify-center flex-shrink-0 ${
                      selectedSize === s
                        ? "btn-3d-primary shadow-xs"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add-to-Cart Button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5 min-w-0 min-h-[2.5rem] sm:min-h-[2.75rem]">
          <div className="min-w-0 flex-1">
            <PriceTag
              price={product.price}
              salePrice={hasDiscount ? currentPrice : null}
              size="md"
            />
          </div>

          <Button
            variant={isAdded ? "secondary" : "amber"}
            size="sm"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`text-xs py-1.5 px-2 sm:px-3 min-h-[32px] sm:min-h-[38px] flex-shrink-0 transition-all duration-300 ${
              isAdded ? "bg-emerald-100 text-emerald-950 border-emerald-300 scale-102" : ""
            } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isOutOfStock ? "نفد من المخزون" : "أضف للسلة سريعاً"}
            aria-label={isOutOfStock ? `${product.name} غير متوفر` : `إضافة ${product.name} إلى السلة`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline font-black text-emerald-800">تمت الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isOutOfStock ? "نفد المخزون" : "أضف للسلة"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
