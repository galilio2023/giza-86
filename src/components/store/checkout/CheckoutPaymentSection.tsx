"use client";

import React from "react";
import { Banknote, Zap, Smartphone, CreditCard, Check, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEGP } from "@/lib/utils";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { CheckoutFormErrors } from "./CheckoutAddressSection";

interface CheckoutPaymentSectionProps {
  enabledPaymentMethods: string[];
  paymentMethod: "cod" | "instapay" | "vodafone_cash" | "card";
  setPaymentMethod: (method: "cod" | "instapay" | "vodafone_cash" | "card") => void;
  finalTotal: number;
  instapayHandle?: string;
  transferRef: string;
  setTransferRef: (val: string) => void;
  copiedInstapay: boolean;
  vodafoneCashPhone?: string;
  vodafoneSenderPhone: string;
  setVodafoneSenderPhone: (val: string) => void;
  vodafoneSenderRef: React.RefObject<HTMLInputElement | null>;
  copiedVodafone: boolean;
  handleCopy: (text: string, type: "instapay" | "vodafone") => void;
  formErrors: CheckoutFormErrors;
  clearError: (field: keyof CheckoutFormErrors) => void;
}

export function CheckoutPaymentSection({
  enabledPaymentMethods,
  paymentMethod,
  setPaymentMethod,
  finalTotal,
  instapayHandle,
  transferRef,
  setTransferRef,
  copiedInstapay,
  vodafoneCashPhone,
  vodafoneSenderPhone,
  setVodafoneSenderPhone,
  vodafoneSenderRef,
  copiedVodafone,
  handleCopy,
  formErrors,
  clearError,
}: CheckoutPaymentSectionProps) {
  return (
    <Card variant="modern" padding="lg" className="space-y-6">
      <h3 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
        <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs flex items-center justify-center font-bold">
          3
        </span>
        <span>طريقة الدفع المناسبة</span>
      </h3>

      <div className="space-y-3">
        {/* Option 1: COD */}
        {enabledPaymentMethods.includes("cod") && (
          <label
            className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              paymentMethod === "cod"
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-4 h-4 text-neutral-900"
                />
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-sm text-neutral-900">
                    الدفع نقدياً عند الاستلام (كاش)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                الأكثر شعبية 🇪🇬
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-2 mr-7 leading-relaxed">
              ادفع كاش لمندوب شركة الشحن بعد معاينة الشحنة والتأكد من المقاس وجودة القماش.
            </p>
          </label>
        )}

        {/* Option 2: InstaPay */}
        {enabledPaymentMethods.includes("instapay") && (
          <label
            className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              paymentMethod === "instapay"
                ? "border-neutral-900 bg-purple-50/40"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "instapay"}
                  onChange={() => setPaymentMethod("instapay")}
                  className="w-4 h-4 text-purple-700"
                />
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-700" />
                  <span className="font-bold text-sm text-neutral-900">
                    تحويل إنستاباي (InstaPay) الفوري
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                بدون رسوم ⚡
              </span>
            </div>

            {paymentMethod === "instapay" && (
              <div className="mt-4 mr-7 p-4 bg-white rounded-xl border border-purple-200 space-y-3">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  قم بتحويل المبلغ الإجمالي (<strong className="text-purple-900 font-bold">{formatEGP(finalTotal)}</strong>) لحساب المتجر على إنستاباي:
                </p>
                <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <div>
                    <span className="text-[10px] text-purple-800 block font-semibold">
                      عنوان الدفع اللحظي (IPA Handle)
                    </span>
                    <span className="text-xs font-black text-purple-950 font-mono" dir="ltr">
                      {instapayHandle || STORE_DEFAULTS.instapayHandle}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(instapayHandle || STORE_DEFAULTS.instapayHandle, "instapay")}
                    className="text-xs font-bold text-purple-800 bg-white border-purple-200 hover:bg-purple-100 gap-1"
                  >
                    {copiedInstapay ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedInstapay ? "تم النسخ" : "نسخ المعرف"}</span>
                  </Button>
                </div>
                <div>
                  <input
                    type="text"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    placeholder="اكتب رقم العملية أو اسم صاحب الحساب المحول منه (اختياري للتأكيد)"
                    className="w-full p-2.5 rounded-lg border border-neutral-200 text-base sm:text-xs"
                  />
                </div>
              </div>
            )}
          </label>
        )}

        {/* Option 3: Vodafone Cash */}
        {enabledPaymentMethods.includes("vodafone_cash") && (
          <label
            className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              paymentMethod === "vodafone_cash"
                ? "border-neutral-900 bg-red-50/40"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "vodafone_cash"}
                  onChange={() => setPaymentMethod("vodafone_cash")}
                  className="w-4 h-4 text-red-700"
                />
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-sm text-neutral-900">
                    فودافون كاش ومحافظ المحمول الذكية
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-red-100 text-red-900 px-2 py-0.5 rounded-full">
                متاح 24/7
              </span>
            </div>

            {paymentMethod === "vodafone_cash" && (
              <div className="mt-4 mr-7 p-4 bg-white rounded-xl border border-red-200 space-y-3">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  قم بتحويل المبلغ (<strong className="text-red-900 font-bold">{formatEGP(finalTotal)}</strong>) لرقم المحفظة:
                </p>
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
                  <div>
                    <span className="text-[10px] text-red-800 block font-semibold">
                      رقم المحفظة الإلكترونية
                    </span>
                    <span className="text-sm font-black text-red-950 font-mono" dir="ltr">
                      {vodafoneCashPhone || STORE_DEFAULTS.vodafoneCashPhone}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(vodafoneCashPhone || STORE_DEFAULTS.vodafoneCashPhone, "vodafone")}
                    className="text-xs font-bold text-red-800 bg-white border-red-200 hover:bg-red-100 gap-1"
                  >
                    {copiedVodafone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVodafone ? "تم النسخ" : "نسخ الرقم"}</span>
                  </Button>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-800">
                    رقم محفظتك المحول منها (أو رقم المعاملة للتأكيد)
                  </label>
                  <input
                    ref={vodafoneSenderRef}
                    type="tel"
                    dir="ltr"
                    value={vodafoneSenderPhone}
                    onChange={(e) => {
                      setVodafoneSenderPhone(e.target.value);
                      if (formErrors.vodafoneSenderPhone) clearError("vodafoneSenderPhone");
                    }}
                    placeholder="010XXXXXXXX"
                    className={`w-full p-2.5 rounded-lg border text-base sm:text-xs text-left focus:outline-none ${
                      formErrors.vodafoneSenderPhone
                        ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500"
                        : "border-neutral-200 focus:ring-2 focus:ring-red-400"
                    }`}
                  />
                  {formErrors.vodafoneSenderPhone && (
                    <span className="text-xs text-rose-600 font-bold block mt-1">
                      {formErrors.vodafoneSenderPhone}
                    </span>
                  )}
                </div>
              </div>
            )}
          </label>
        )}

        {/* Option 4: Card */}
        {enabledPaymentMethods.includes("card") && (
          <label
            className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              paymentMethod === "card"
                ? "border-neutral-900 bg-blue-50/40"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="w-4 h-4 text-blue-700"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                  <span className="font-bold text-sm text-neutral-900">
                    الدفع بالبطاقة البنكية (فيزا / ماستركارد / ميزة)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                دفع إلكتروني آمن
              </span>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-3 mr-7 p-3.5 bg-white rounded-xl border border-blue-200 space-y-1.5 text-xs text-neutral-600">
                <p className="font-semibold text-blue-950">
                  💳 الدفع الإلكتروني متاح عبر ماكينة الدفع المحمولة (POS):
                </p>
                <p className="leading-relaxed text-[11px]">
                  سيقوم مندوب شركة الشحن بتوفير ماكينة دفع إلكتروني لاسلكية عند التوصيل لتقوم بتمرير أو إدخال بطاقتك البنكية بأمان بعد معاينة الشحنة والتأكد من المقاسات.
                </p>
              </div>
            )}
          </label>
        )}
      </div>
    </Card>
  );
}
