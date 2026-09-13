"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EGYPTIAN_GOVERNORATES, isValidEgyptianPhone } from "@/lib/egypt-constants";

export interface CheckoutFormErrors {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
  vodafoneSenderPhone?: string;
}

interface CheckoutAddressSectionProps {
  fullName: string;
  setFullName: (val: string) => void;
  fullNameRef: React.RefObject<HTMLInputElement | null>;
  phone: string;
  setPhone: (val: string) => void;
  phoneRef: React.RefObject<HTMLInputElement | null>;
  alternatePhone: string;
  setAlternatePhone: (val: string) => void;
  selectedGovernorate: string;
  setSelectedGovernorate: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  cityRef: React.RefObject<HTMLInputElement | null>;
  address: string;
  setAddress: (val: string) => void;
  addressRef: React.RefObject<HTMLTextAreaElement | null>;
  notes: string;
  setNotes: (val: string) => void;
  formErrors: CheckoutFormErrors;
  clearError: (field: keyof CheckoutFormErrors) => void;
}

export function CheckoutAddressSection({
  fullName,
  setFullName,
  fullNameRef,
  phone,
  setPhone,
  phoneRef,
  alternatePhone,
  setAlternatePhone,
  selectedGovernorate,
  setSelectedGovernorate,
  city,
  setCity,
  cityRef,
  address,
  setAddress,
  addressRef,
  notes,
  setNotes,
  formErrors,
  clearError,
}: CheckoutAddressSectionProps) {
  return (
    <>
      {/* 1. Customer Information */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <h3 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs flex items-center justify-center font-bold">
            1
          </span>
          <span>بيانات المستلم والتواصل</span>
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">
              الاسم بالكامل <span className="text-rose-600">*</span>
            </label>
            <input
              ref={fullNameRef}
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (formErrors.fullName) clearError("fullName");
              }}
              placeholder="مثال: أحمد محمد مصطفى"
              className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition focus:outline-none ${
                formErrors.fullName
                  ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500"
                  : "border-neutral-200 focus:ring-2 focus:ring-amber-500"
              }`}
            />
            {formErrors.fullName && (
              <span className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formErrors.fullName}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                رقم الهاتف الأساسي (11 رقم) <span className="text-rose-600">*</span>
              </label>
              <input
                ref={phoneRef}
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone) clearError("phone");
                }}
                placeholder="01012345678"
                className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm text-left transition focus:outline-none ${
                  formErrors.phone || (phone && !isValidEgyptianPhone(phone))
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500"
                    : "border-neutral-200 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.phone ? (
                <span className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formErrors.phone}</span>
                </span>
              ) : phone && !isValidEgyptianPhone(phone) ? (
                <span className="text-xs text-rose-600 font-medium block mt-1">
                  يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً
                </span>
              ) : null}
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                رقم هاتف إضافي / واتساب (اختياري)
              </label>
              <input
                type="tel"
                dir="ltr"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                placeholder="01298765432"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-base sm:text-sm text-left focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Shipping Address */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <h3 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs flex items-center justify-center font-bold">
            2
          </span>
          <span>عنوان التوصيل في مصر</span>
        </h3>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                المحافظة <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-base sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white cursor-pointer"
              >
                {EGYPTIAN_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.name}>
                    {gov.name} ({gov.rate} ج.م - {gov.deliveryDays})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                المنطقة / الحي / المركز <span className="text-rose-600">*</span>
              </label>
              <input
                ref={cityRef}
                type="text"
                required
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (formErrors.city) clearError("city");
                }}
                placeholder="مثال: المعادي الجديدة، سموحة، أكتوبر، حي الجامعة..."
                className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition focus:outline-none ${
                  formErrors.city
                    ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500"
                    : "border-neutral-200 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.city && (
                <span className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formErrors.city}</span>
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-neutral-800">
                العنوان بالتفصيل والعلامة المميزة <span className="text-rose-600">*</span>
              </label>
              <span className={`text-[11px] font-mono ${address.trim().length >= 10 ? "text-emerald-700 font-bold" : "text-neutral-500"}`}>
                {address.trim().length} / 10 حروف كحد أدنى
              </span>
            </div>
            <textarea
              ref={addressRef}
              required
              rows={3}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (formErrors.address) clearError("address");
              }}
              placeholder="اسم الشارع، رقم العقار، رقم الدور، رقم الشقة، وأقرب علامة مميزة..."
              className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition leading-relaxed focus:outline-none ${
                formErrors.address
                  ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500"
                  : "border-neutral-200 focus:ring-2 focus:ring-amber-500"
              }`}
            />
            {formErrors.address && (
              <span className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formErrors.address}</span>
              </span>
            )}
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">
              ملاحظات خاصة للمندوب (اختياري)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: الاتصال قبل الوصول بنصف ساعة..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>
    </>
  );
}
