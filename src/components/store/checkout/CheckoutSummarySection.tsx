"use client";

import React from "react";
import Image from "next/image";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEGP } from "@/lib/utils";
import { CartItem } from "@/types";

interface CheckoutSummarySectionProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  selectedGovernorate: string;
  isFreeShipping: boolean;
  discountAmount: number;
  finalTotal: number;
  couponCode: string;
  setCouponCode: (val: string) => void;
  handleApplyCoupon: (e: React.FormEvent) => void;
  couponLoading: boolean;
  appliedCoupon: string | null;
  submitting: boolean;
}

export function CheckoutSummarySection({
  items,
  subtotal,
  shippingFee,
  selectedGovernorate,
  isFreeShipping,
  discountAmount,
  finalTotal,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  couponLoading,
  appliedCoupon,
  submitting,
}: CheckoutSummarySectionProps) {
  return (
    <Card variant="modern" padding="lg" className="space-y-6 sticky top-28">
      <h3 className="text-base sm:text-lg font-black text-neutral-900 border-b border-neutral-100 pb-3 flex items-center justify-between">
        <span>ملخص سلة الطلب</span>
        <span className="text-xs font-normal text-neutral-500">
          {items.reduce((acc, i) => acc + i.quantity, 0)} قطعة
        </span>
      </h3>

      {/* Items preview */}
      <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-neutral-100">
        {items.map((i) => (
          <div key={i.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
              <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-neutral-900 line-clamp-1">{i.name}</h4>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                مقاس {i.selectedSize} • {i.selectedColor.name} • كمية {i.quantity}
              </div>
              <div className="font-bold text-neutral-900 mt-1">
                {formatEGP((i.salePrice || i.price) * i.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Input */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="أدخل كود الخصم (مثل: EGYPT20)"
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm font-mono uppercase"
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApplyCoupon}
            isLoading={couponLoading}
            disabled={couponLoading || !couponCode.trim()}
            className="min-h-[44px] px-4 font-bold"
          >
            {couponLoading ? "تفعيل..." : "تطبيق"}
          </Button>
        </div>
        {appliedCoupon && (
          <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg mt-2">
            <span className="flex items-center gap-1 font-bold">
              <Check className="w-3.5 h-3.5" />
              تم تفعيل كود الخصم ({appliedCoupon})
            </span>
            <span className="font-black">-{formatEGP(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Calculations */}
      <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs">
        <div className="flex items-center justify-between text-neutral-600">
          <span>المجموع الفرعي:</span>
          <span className="font-bold text-neutral-900">{formatEGP(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-neutral-600">
          <span>مصاريف الشحن ({selectedGovernorate}):</span>
          <span className="font-bold text-neutral-900">
            {isFreeShipping ? (
              <span className="text-emerald-700 font-bold">شحن مجاني 🎉</span>
            ) : (
              formatEGP(shippingFee)
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span>قيمة الخصم:</span>
            <span>-{formatEGP(discountAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-base font-black text-neutral-900">الإجمالي النهائي:</span>
          <span className="text-2xl font-black text-amber-700">
            {formatEGP(finalTotal)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="amber"
        size="xl"
        fullWidth
        isLoading={submitting}
        className="gap-2 text-base"
      >
        <Lock className="w-4 h-4" />
        <span>{submitting ? "جاري تسجيل الطلب..." : "تأكيد الطلب الآن"}</span>
      </Button>

      <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>بياناتك مؤمنة بالكامل ومعاينة المنتجات مكفولة قبل الدفع</span>
      </div>
    </Card>
  );
}
