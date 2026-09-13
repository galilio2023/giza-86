"use client";

import React from "react";
import { Power } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmergencySettingsTabProps {
  isAcceptingOrders: boolean;
  setIsAcceptingOrders: (val: boolean) => void;
  orderClosedMessage: string;
  setOrderClosedMessage: (val: string) => void;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (val: boolean) => void;
  maintenanceMessage: string;
  setMaintenanceMessage: (val: string) => void;
}

export function EmergencySettingsTab({
  isAcceptingOrders,
  setIsAcceptingOrders,
  orderClosedMessage,
  setOrderClosedMessage,
  isMaintenanceMode,
  setIsMaintenanceMode,
  maintenanceMessage,
  setMaintenanceMessage,
}: EmergencySettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="border-2 border-neutral-900 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-900">
              مفاتيح التحكم والتشغيل الفوري (Master Kill-Switches)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              تأثير فوري ومباشر على سلوك وتوفر المتجر أمام العملاء
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Switch 1: Accept Orders */}
          <div
            className={`p-5 rounded-2xl border-2 transition ${
              isAcceptingOrders ? "bg-emerald-50/60 border-emerald-400" : "bg-rose-50/60 border-rose-400"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs text-neutral-900">حالة استقبال الطلبات:</span>
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${
                  isAcceptingOrders ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                }`}
              >
                {isAcceptingOrders ? "مفتوح ومستعد" : "مغلق وموقف"}
              </span>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAcceptingOrders}
                onChange={(e) => setIsAcceptingOrders(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-neutral-800">
                السماح للعملاء بإتمام طلبات جديدة والدفع
              </span>
            </label>

            {!isAcceptingOrders && (
              <div className="mt-3 pt-3 border-t border-rose-200 space-y-1.5">
                <label className="block text-[11px] font-bold text-rose-900">
                  رسالة الإغلاق التوضيحية الموجهة للعميل:
                </label>
                <textarea
                  rows={2}
                  value={orderClosedMessage}
                  onChange={(e) => setOrderClosedMessage(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-lg border border-rose-300 text-xs"
                />
              </div>
            )}
          </div>

          {/* Switch 2: Maintenance Mode */}
          <div
            className={`p-5 rounded-2xl border-2 transition ${
              isMaintenanceMode ? "bg-rose-100/70 border-rose-500" : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs text-neutral-900">وضع الصيانة الكاملة:</span>
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${
                  isMaintenanceMode ? "bg-rose-700 text-white" : "bg-neutral-300 text-neutral-700"
                }`}
              >
                {isMaintenanceMode ? "مفعل (المتجر مغلق)" : "معطل (المتجر يعمل)"}
              </span>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isMaintenanceMode}
                onChange={(e) => setIsMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded text-rose-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-neutral-800">
                تحويل المتجر لوضع الصيانة الفورية
              </span>
            </label>

            {isMaintenanceMode && (
              <div className="mt-3 pt-3 border-t border-rose-300 space-y-1.5">
                <label className="block text-[11px] font-bold text-rose-950">
                  رسالة الصيانة التي تظهر للزوار:
                </label>
                <textarea
                  rows={2}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-lg border border-rose-300 text-xs"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
