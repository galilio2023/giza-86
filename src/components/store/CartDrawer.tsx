"use client";

import Link from "next/link";
import { X, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatEGP } from "@/lib/utils";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { CartItemRow, FreeShippingProgress } from "./cart";
import { useMounted } from "@/hooks/useMounted";
import { useScrollLock } from "@/hooks/useScrollLock";

interface CartDrawerProps {
  freeShippingThreshold?: number;
}

export function CartDrawer({ freeShippingThreshold }: CartDrawerProps = {}) {
  const mounted = useMounted();
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const FREE_SHIPPING_LIMIT = freeShippingThreshold ?? STORE_DEFAULTS.freeShippingThreshold;

  useScrollLock(!!isOpen);

  if (!mounted) return null;
  if (!isOpen) return null;

  const subtotal = getSubtotal();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-[80] overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in-0"
      />

      {/* Drawer Container (flush docked to right for natural Arabic RTL flow) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex z-[80]">
        <div className="w-full sm:w-[420px] max-w-full bg-white shadow-2xl flex flex-col h-full border-l border-neutral-200 animate-in slide-in-from-right duration-300 ease-out">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 id="cart-drawer-title" className="text-base sm:text-lg font-black text-neutral-900">سلة المشتريات</h2>
              <span className="bg-amber-100 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black">
                {items.reduce((acc, i) => acc + i.quantity, 0)} قطعة
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-full transition cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (Egyptian Market Appeal) */}
          <FreeShippingProgress subtotal={subtotal} threshold={FREE_SHIPPING_LIMIT} variant="drawer" />

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-black text-neutral-800">سلتك فارغة حالياً</p>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                    استكشف تشكيلات الأزياء المصنوعة من القطن المصري الأصيل وأضف ما يناسبك
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition"
                >
                  تصفح المنتجات الآن
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0">
                  <CartItemRow
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    compact
                  />
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-neutral-900">{formatEGP(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <span>مصاريف الشحن:</span>
                  <span>
                    {subtotal >= FREE_SHIPPING_LIMIT ? (
                      <span className="text-emerald-600 font-bold">مجاناً 🎉</span>
                    ) : (
                      "تحسب عند إدخال المحافظة"
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900">الإجمالي التقديري:</span>
                <span className="text-xl font-black text-amber-700">
                  {formatEGP(subtotal)}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 btn-3d-gold font-black py-3.5 px-4 rounded-xl text-sm transition shadow-md active:scale-98"
                >
                  <span>متابعة إتمام الطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="text-neutral-600 hover:text-amber-800 font-bold underline transition text-[11px]"
                  >
                    عرض وتعديل سلة المشتريات بالكامل
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-700 font-medium text-[11px] cursor-pointer"
                  >
                    إفراغ السلة
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>معاينة مجانية قبل الاستلام والدفع كاش أو إنستاباي</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
