"use client";

import React from "react";
import { Bell, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface PromoSettingsTabProps {
  isBannerActive: boolean;
  setIsBannerActive: (val: boolean) => void;
  bannerNotice: string;
  setBannerNotice: (val: string) => void;
  isPromoBannerActive: boolean;
  setIsPromoBannerActive: (val: boolean) => void;
  promoBadge: string;
  setPromoBadge: (val: string) => void;
  promoCouponCode: string;
  setPromoCouponCode: (val: string) => void;
  promoTitle: string;
  setPromoTitle: (val: string) => void;
  promoDescription: string;
  setPromoDescription: (val: string) => void;
}

export function PromoSettingsTab({
  isBannerActive,
  setIsBannerActive,
  bannerNotice,
  setBannerNotice,
  isPromoBannerActive,
  setIsPromoBannerActive,
  promoBadge,
  setPromoBadge,
  promoCouponCode,
  setPromoCouponCode,
  promoTitle,
  setPromoTitle,
  promoDescription,
  setPromoDescription,
}: PromoSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Marquee Notice */}
      <Card variant="modern" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>شريط الإعلان العلوي في أعلى المتجر (Top Announcement Strip)</span>
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBannerActive}
              onChange={(e) => setIsBannerActive(e.target.checked)}
              className="w-5 h-5 rounded text-amber-600 cursor-pointer"
            />
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                isBannerActive ? "bg-amber-500 text-neutral-950" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {isBannerActive ? "مفعل وظاهر" : "معطل ومخفي"}
            </span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-800">
            نص الإعلان العلوي
          </label>
          <textarea
            rows={2}
            value={bannerNotice}
            onChange={(e) => setBannerNotice(e.target.value)}
            placeholder="مثال: 🔥 شحن سريع لجميع الـ 27 محافظة | جودة القطن المصري 100% | الدفع عند الاستلام وإنستاباي"
            className="w-full p-3 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white transition"
          />
          <p className="text-[11px] text-neutral-500">
            يظهر هذا الشريط في أعلى كل صفحات المتجر فوق قائمة التنقل لجذب انتباه العملاء.
          </p>
        </div>
      </Card>

      {/* Special Offer Card Banner */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <span>بانر العرض الترويجي الخاص وكود الخصم (Promo Offer Banner)</span>
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPromoBannerActive}
              onChange={(e) => setIsPromoBannerActive(e.target.checked)}
              className="w-5 h-5 rounded text-rose-600 cursor-pointer"
            />
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                isPromoBannerActive ? "bg-rose-600 text-white" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {isPromoBannerActive ? "مفعل بالصفحة الرئيسية" : "معطل ومخفي"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              نص شارة العرض
            </label>
            <input
              type="text"
              value={promoBadge}
              onChange={(e) => setPromoBadge(e.target.value)}
              placeholder="عرض خاص لعملاء مصر 🇪🇬"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              كود الخصم القابل للنسخ (Coupon Code)
            </label>
            <input
              type="text"
              dir="ltr"
              value={promoCouponCode}
              onChange={(e) => setPromoCouponCode(e.target.value.toUpperCase())}
              placeholder="EGYPT20"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-black font-mono text-left bg-neutral-50 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-800">
            عنوان العرض الرئيسي
          </label>
          <input
            type="text"
            value={promoTitle}
            onChange={(e) => setPromoTitle(e.target.value)}
            placeholder="خصم 20% إضافي على إجمالي سلة المشتريات!"
            className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-black bg-neutral-50 focus:bg-white transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-800">
            شرح تفاصيل العرض وشروطه
          </label>
          <textarea
            rows={2}
            value={promoDescription}
            onChange={(e) => setPromoDescription(e.target.value)}
            placeholder={STORE_DEFAULTS.promoDescription}
            className="w-full p-3 rounded-xl border border-neutral-300 text-xs bg-neutral-50 focus:bg-white transition"
          />
        </div>
      </Card>
    </div>
  );
}
