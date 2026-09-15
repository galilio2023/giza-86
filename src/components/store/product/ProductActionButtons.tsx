"use client";

import { Check, ShoppingBag, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { ProductItem } from "@/types";
import { formatEGP } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface ProductActionButtonsProps {
  product?: ProductItem;
  currentPrice: number;
  quantity: number;
  isOutOfStock: boolean;
  isAdded: boolean;
  onAddToCart: () => void;
  onWhatsAppOrder: () => void;
}

export function ProductActionButtons({
  currentPrice,
  quantity,
  isOutOfStock,
  isAdded,
  onAddToCart,
  onWhatsAppOrder,
}: ProductActionButtonsProps) {
  return (
    <div className="space-y-6 pt-4 border-t border-neutral-200">
      {/* Out of Stock Luxury Banner */}
      {isOutOfStock && (
        <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-800 space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 font-black text-xs text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>الدفعة الحالية نفدت بالكامل ✨ SOLD OUT</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            الدفعة الجديدة قيد التصنيع في مصانعنا. تواصل معنا عبر واتساب لحجز مقاسك وإشعارك فور وصولها قبل نفاد الكمية!
          </p>
        </div>
      )}

      {/* CTAs: Add to Cart & WhatsApp */}
      <div className="space-y-3">
        {isOutOfStock ? (
          <button
            type="button"
            onClick={onWhatsAppOrder}
            className="w-full flex items-center justify-center gap-2.5 font-black py-4 px-6 rounded-2xl text-base transition-all duration-300 shadow-lg active:scale-98 cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-white border border-[#c59b27] hover:border-amber-400 group shadow-amber-500/10"
          >
            <WhatsAppIcon className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />
            <span className="group-hover:text-amber-300 transition-colors text-sm sm:text-base">
              أعلمني فور توفر المقاس عبر واتساب 🔔
            </span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onAddToCart}
              className={`w-full flex items-center justify-center gap-2.5 font-black py-4 px-6 rounded-2xl text-base transition-all duration-300 shadow-lg active:scale-98 cursor-pointer ${
                isAdded
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>تمت الإضافة إلى السلة بنجاح ✓</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <span>إضافة إلى سلة المشتريات ({formatEGP(currentPrice * quantity)})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onWhatsAppOrder}
              className="w-full flex items-center justify-between gap-3 bg-neutral-950 hover:bg-neutral-900 text-white font-bold py-3 px-5 rounded-2xl text-sm transition-all duration-300 border border-[#c59b27]/80 hover:border-amber-400 shadow-md shadow-black/20 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />
                <span className="group-hover:text-amber-300 transition-colors whitespace-nowrap text-xs sm:text-sm">
                  اطلب سريعاً عبر واتساب<span className="hidden sm:inline"> مع المبيعات</span>
                </span>
              </div>
              <span className="text-[11px] font-normal text-amber-400/90 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full hidden sm:inline whitespace-nowrap">
                رد فوري ⚡
              </span>
            </button>
          </>
        )}
      </div>

      {/* Guarantee and Shipping Highlights */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 space-y-3 text-sm text-neutral-700">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {isOutOfStock
              ? "أولوية حجز وشحن فوري فور وصول الدفعة الجديدة بالمخزن"
              : "شحن وتوصيل لكافة المحافظات خلال 1-3 أيام عمل"}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>حق المعاينة والتأكد من المقاس والخامة قبل دفع المبلغ للمندوب</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>استبدال واسترجاع سهل وسريع خلال 14 يوماً</span>
        </div>
      </div>
    </div>
  );
}
