"use client";

import { Minus, Plus, Ruler } from "lucide-react";
import { ProductItem, ProductColor } from "@/types";

interface ProductVariantSelectorProps {
  product: ProductItem;
  selectedColor: ProductColor;
  onColorSelect: (color: ProductColor) => void;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  onOpenSizeGuide?: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isOutOfStock: boolean;
}

export function ProductVariantSelector({
  product,
  selectedColor,
  onColorSelect,
  selectedSize,
  onSizeSelect,
  onOpenSizeGuide,
  quantity,
  onQuantityChange,
  isOutOfStock,
}: ProductVariantSelectorProps) {
  const currentVariant = product.variants?.find(
    (v) =>
      v.size.trim().toUpperCase() === selectedSize.trim().toUpperCase() &&
      v.colorName.trim() === selectedColor.name.trim()
  );
  const maxStock = currentVariant !== undefined ? currentVariant.stock : product.stock;
  const isSelectedOutOfStock = isOutOfStock || maxStock <= 0;

  const isSizeAvailableInColor = (s: string) => {
    if (!product.variants || product.variants.length === 0) return true;
    const v = product.variants.find(
      (item) =>
        item.size.trim().toUpperCase() === s.trim().toUpperCase() &&
        item.colorName.trim() === selectedColor.name.trim()
    );
    return v ? v.stock > 0 : true;
  };

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-900">اللون المختار:</span>
            <span className="text-neutral-500 font-semibold">{selectedColor.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onColorSelect(c)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  selectedColor.hex === c.hex
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-900">المقاس:</span>
            {onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="text-neutral-700 hover:text-neutral-950 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>جدول المقاسات بالسنتيمتر</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const available = isSizeAvailableInColor(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSizeSelect(s)}
                  className={`min-w-12 h-11 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    selectedSize === s
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-xs"
                      : available
                      ? "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      : "border-neutral-200/60 bg-neutral-100 text-neutral-400 opacity-60 line-through"
                  }`}
                  title={available ? undefined : "غير متوفر بهذا اللون حالياً"}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-xs font-bold text-neutral-900">الكمية:</span>
        <div className="flex items-center border border-neutral-200 rounded-xl bg-white shadow-xs">
          <button
            type="button"
            disabled={isSelectedOutOfStock || quantity <= 1}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 rounded-r-xl transition font-bold disabled:opacity-40 cursor-pointer"
            aria-label="تقليل الكمية"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 text-sm font-bold text-neutral-900">
            {isSelectedOutOfStock ? 0 : quantity}
          </span>
          <button
            type="button"
            disabled={isSelectedOutOfStock || quantity >= maxStock}
            onClick={() => onQuantityChange(Math.min(maxStock, quantity + 1))}
            className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 rounded-l-xl transition font-bold disabled:opacity-40 cursor-pointer"
            aria-label="زيادة الكمية"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
