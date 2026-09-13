"use client";

import { Check, ShoppingBag } from "lucide-react";
import { formatEGP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface ProductMobileStickyBarProps {
  currentPrice: number;
  quantity: number;
  selectedSize: string;
  isOutOfStock: boolean;
  isAdded: boolean;
  onAddToCart: () => void;
  onWhatsAppOrder: () => void;
}

export function ProductMobileStickyBar({
  currentPrice,
  quantity,
  selectedSize,
  isOutOfStock,
  isAdded,
  onAddToCart,
  onWhatsAppOrder,
}: ProductMobileStickyBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/98 backdrop-blur-md border-t border-neutral-200 px-4 pt-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-50 flex items-center justify-between gap-2.5 shadow-2xl">
      <div>
        <span className="text-[10px] text-neutral-500 block leading-tight font-medium">السعر:</span>
        <span className="text-base font-black text-neutral-900">
          {formatEGP(currentPrice * quantity)}
        </span>
      </div>

      <button
        type="button"
        onClick={onWhatsAppOrder}
        className="h-11 w-11 p-1 bg-neutral-950 hover:bg-neutral-900 border border-[#c59b27]/80 hover:border-amber-400 rounded-xl transition flex items-center justify-center cursor-pointer flex-shrink-0 shadow-xs active:scale-95 group"
        title="استفسار واتساب بخصوص هذا الموديل"
        aria-label="تواصل واتساب"
      >
        <WhatsAppIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
      </button>

      <Button
        variant={isAdded ? "secondary" : "amber"}
        size="md"
        disabled={isOutOfStock}
        onClick={onAddToCart}
        className={`flex-1 gap-1.5 font-black transition-all duration-300 ${
          isAdded
            ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
            : "shadow-md shadow-amber-500/20"
        } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>تمت الإضافة بنجاح ✓</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? "نفد المخزون"
                : selectedSize === "مقاس موحد" || selectedSize === "One Size"
                ? "أضف للسلة"
                : `أضف للسلة (${selectedSize})`}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
