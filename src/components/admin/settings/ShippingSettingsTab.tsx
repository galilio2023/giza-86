"use client";

import React from "react";
import { Truck, Clock, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EGYPTIAN_GOVERNORATES, STORE_DEFAULTS } from "@/lib/egypt-constants";

interface ShippingSettingsTabProps {
  freeShippingThreshold: string;
  setFreeShippingThreshold: (val: string) => void;
  estimatedDeliveryDays: string;
  setEstimatedDeliveryDays: (val: string) => void;
  governoratesRates: Record<string, number>;
  onRateChange: (govName: string, rate: number) => void;
}

export function ShippingSettingsTab({
  freeShippingThreshold,
  setFreeShippingThreshold,
  estimatedDeliveryDays,
  setEstimatedDeliveryDays,
  governoratesRates,
  onRateChange,
}: ShippingSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="space-y-6">
        <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <Truck className="w-5 h-5 text-amber-600" />
          <span>إعدادات الشحن العامة والحد الأدنى المجاني</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              الحد الأدنى للشحن المجاني (ج.م)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              placeholder={String(STORE_DEFAULTS.freeShippingThreshold)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-mono bg-neutral-50 focus:bg-white transition"
            />
            <p className="text-[11px] text-neutral-500">
              إذا وصل إجمالي سلة المشتريات لهذا الرقم، يصبح الشحن 0 ج.م مجاناً للعميل.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-600" />
              <span>المدة التقديرية للتوصيل</span>
            </label>
            <input
              type="text"
              value={estimatedDeliveryDays}
              onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
              placeholder="1 - 3 أيام عمل لجميع المحافظات"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50 focus:bg-white transition"
            />
          </div>
        </div>
      </Card>

      {/* 27 Governorates Rates */}
      <Card variant="modern" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <span>أسعار الشحن المخصصة لكافة الـ 27 محافظة مصرية</span>
          </h3>
        </div>

        <p className="text-xs text-neutral-500">
          يتم احتساب هذه القيمة تلقائياً وفورياً عند اختيار العميل لمحافظته في صفحة إتمام الطلب (Checkout).
        </p>

        <div className="max-h-[600px] overflow-y-auto divide-y divide-neutral-100 pr-2 border rounded-2xl p-2 bg-neutral-50/50">
          {EGYPTIAN_GOVERNORATES.map((gov) => {
            const currentRate = governoratesRates[gov.name] ?? gov.rate;
            return (
              <div
                key={gov.id}
                className="py-2.5 px-3 flex items-center justify-between gap-4 text-xs hover:bg-white rounded-xl transition"
              >
                <div>
                  <span className="font-bold text-neutral-900 block">{gov.name}</span>
                  <span className="text-[10px] text-neutral-400">
                    {gov.region} • وقت التسليم المعتاد: {gov.deliveryDays}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={currentRate}
                    onChange={(e) => onRateChange(gov.name, Number(e.target.value))}
                    className="w-24 p-1.5 rounded-lg border border-neutral-300 text-left font-bold text-xs bg-white"
                  />
                  <span className="text-neutral-500 font-bold">ج.م</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
