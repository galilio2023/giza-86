"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck 
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatEGP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartItemRow, FreeShippingProgress } from "./cart";
import { useMounted } from "@/hooks/useMounted";

interface CartClientProps {
  settings?: {
    freeShippingThreshold?: number;
  };
}

export function CartClient({ settings }: CartClientProps = {}) {
  const mounted = useMounted();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const freeShippingThreshold = settings?.freeShippingThreshold ?? 1200;

  if (!mounted) return null;

  const subtotal = getSubtotal();

  return (
    <div className="layout-container py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">سلة المشتريات</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            لديك {items.reduce((acc, i) => acc + i.quantity, 0)} قطعة في سلتك
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>إفراغ السلة</span>
          </Button>
        )}
      </div>

      {/* Free Shipping Progress Indicator */}
      {items.length > 0 && (
        <FreeShippingProgress
          subtotal={subtotal}
          threshold={freeShippingThreshold}
          className="mt-6"
        />
      )}

      {items.length === 0 ? (
        <Card variant="modern" padding="lg" className="py-20 text-center space-y-4 mt-8">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">سلة التسوق فارغة حالياً</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            تصفح تشكيلاتنا العصرية من القطن المصري الفاخر واختر المقاسات المناسبة لك.
          </p>
          <Link href="/products">
            <Button variant="primary" size="md" className="gap-2">
              <span>تصفح الموديلات</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            <Card variant="modern" padding="none" className="divide-y divide-neutral-100 overflow-hidden">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </Card>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <ArrowRight className="w-4 h-4" />
              <span>متابعة التسوق وإضافة المزيد</span>
            </Link>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card variant="modern" padding="lg" className="space-y-6">
              <h3 className="font-black text-neutral-900 text-lg border-b border-neutral-100 pb-3">
                ملخص الطلب
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-neutral-900">{formatEGP(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>الشحن:</span>
                  <span className="text-xs text-neutral-500">يحسب في الخطوة التالية</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-base">المجموع:</span>
                <span className="text-2xl font-black text-amber-700">{formatEGP(subtotal)}</span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button variant="primary" size="xl" fullWidth className="gap-2">
                  <span>متابعة الشراء والدفع</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>الدفع عند الاستلام بعد فحص المقاس والخامة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>شحن مجاني للطلبات بقيمة {formatEGP(freeShippingThreshold)} فما فوق</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
