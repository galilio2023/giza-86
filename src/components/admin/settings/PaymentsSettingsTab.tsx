"use client";

import React from "react";
import { CreditCard, Zap, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

type PaymentMethodType = "cod" | "instapay" | "vodafone_cash" | "card";

interface PaymentsSettingsTabProps {
  enabledPaymentMethods: PaymentMethodType[];
  onTogglePaymentMethod: (method: PaymentMethodType) => void;
  instapayHandle: string;
  setInstapayHandle: (val: string) => void;
  vodafoneCashPhone: string;
  setVodafoneCashPhone: (val: string) => void;
}

export function PaymentsSettingsTab({
  enabledPaymentMethods,
  onTogglePaymentMethod,
  instapayHandle,
  setInstapayHandle,
  vodafoneCashPhone,
  setVodafoneCashPhone,
}: PaymentsSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="space-y-6">
        <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <span>تفعيل وإلغاء وسائل الدفع للعملاء</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* COD */}
          <label
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
              enabledPaymentMethods.includes("cod")
                ? "bg-amber-50/70 border-amber-500 font-bold shadow-xs"
                : "bg-neutral-50 border-neutral-200 opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={enabledPaymentMethods.includes("cod")}
              onChange={() => onTogglePaymentMethod("cod")}
              className="w-4 h-4 rounded text-amber-600 cursor-pointer"
            />
            <div>
              <span className="block font-bold">الدفع عند الاستلام</span>
              <span className="text-[10px] text-neutral-500 font-normal">معاينة وفحص قبل الدفع</span>
            </div>
          </label>

          {/* InstaPay */}
          <label
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
              enabledPaymentMethods.includes("instapay")
                ? "bg-purple-50/70 border-purple-500 font-bold shadow-xs"
                : "bg-neutral-50 border-neutral-200 opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={enabledPaymentMethods.includes("instapay")}
              onChange={() => onTogglePaymentMethod("instapay")}
              className="w-4 h-4 rounded text-purple-600 cursor-pointer"
            />
            <div>
              <span className="block font-bold">إنستاباي (InstaPay)</span>
              <span className="text-[10px] text-neutral-500 font-normal">تحويل لحظي بالمعرف</span>
            </div>
          </label>

          {/* Vodafone Cash */}
          <label
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
              enabledPaymentMethods.includes("vodafone_cash")
                ? "bg-red-50/70 border-red-500 font-bold shadow-xs"
                : "bg-neutral-50 border-neutral-200 opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={enabledPaymentMethods.includes("vodafone_cash")}
              onChange={() => onTogglePaymentMethod("vodafone_cash")}
              className="w-4 h-4 rounded text-red-600 cursor-pointer"
            />
            <div>
              <span className="block font-bold">فودافون كاش والمحافظ</span>
              <span className="text-[10px] text-neutral-500 font-normal">محافظ الهواتف الذكية</span>
            </div>
          </label>

          {/* Card / Meeza */}
          <label
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
              enabledPaymentMethods.includes("card")
                ? "bg-blue-50/70 border-blue-500 font-bold shadow-xs"
                : "bg-neutral-50 border-neutral-200 opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={enabledPaymentMethods.includes("card")}
              onChange={() => onTogglePaymentMethod("card")}
              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
            />
            <div>
              <span className="block font-bold">بطاقات بنكية / ميزة</span>
              <span className="text-[10px] text-neutral-500 font-normal">فيزا وماستركارد وميزة</span>
            </div>
          </label>
        </div>
      </Card>

      {/* Payment Account Details */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <h3 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <Zap className="w-5 h-5 text-purple-600" />
          <span>بيانات حسابات التحويل المباشر في صفحة إتمام الطلب</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>معرف إنستاباي للدفع اللحظي (IPA Handle)</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={instapayHandle}
              onChange={(e) => setInstapayHandle(e.target.value)}
              placeholder={STORE_DEFAULTS.instapayHandle}
              className="w-full p-2.5 rounded-xl border border-neutral-300 font-mono text-left text-xs bg-neutral-50 focus:bg-white transition"
            />
            <p className="text-[11px] text-neutral-500">
              يمكن للعميل نسخ المعرف مباشرة من شاشة الدفع لإتمام التحويل من تطبيقه البنكي.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-red-600" />
              <span>رقم محفظة فودافون كاش / المحافظ الذكية</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={vodafoneCashPhone}
              onChange={(e) => setVodafoneCashPhone(e.target.value)}
              placeholder={STORE_DEFAULTS.vodafoneCashPhone}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-xs bg-neutral-50 focus:bg-white transition"
            />
            <p className="text-[11px] text-neutral-500">
              الرقم الذي يستقبل تحويلات فودافون كاش ومحافظ المحمول الذكية.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
