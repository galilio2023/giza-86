"use client";

import React from "react";
import Image from "next/image";
import { Store, Image as ImageIcon, Upload, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GeneralSettingsTabProps {
  storeName: string;
  setStoreName: (val: string) => void;
  storeTagline: string;
  setStoreTagline: (val: string) => void;
  storeDescription: string;
  setStoreDescription: (val: string) => void;
  logoUrl: string;
  setLogoUrl: (val: string) => void;
  uploadingLogo: boolean;
  onUploadLogoClick: () => void;
}

export function GeneralSettingsTab({
  storeName,
  setStoreName,
  storeTagline,
  setStoreTagline,
  storeDescription,
  setStoreDescription,
  logoUrl,
  setLogoUrl,
  uploadingLogo,
  onUploadLogoClick,
}: GeneralSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="space-y-6">
        <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <Store className="w-5 h-5 text-amber-600" />
          <span>الهوية والعلامة التجارية (Brand Identity)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              اسم المتجر الرسمي (Store Name)
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="مثال: GIZA 86 أو الاسم التجاري لمتجرك"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white transition"
            />
            <p className="text-[11px] text-neutral-500">
              سيتم تحديث هذا الاسم فوراً في النافبار، الفوتر، رسائل الواتساب، والفوترة الإلكترونية.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              شعار العلامة التجارية (Store Tagline)
            </label>
            <input
              type="text"
              value={storeTagline}
              onChange={(e) => setStoreTagline(e.target.value)}
              placeholder="مثال: العلامة المصرية الرائدة في أزياء القطن المصري الفاخر"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50 focus:bg-white transition"
            />
            <p className="text-[11px] text-neutral-500">
              يظهر أسفل الشعار في الفوتر ومحركات البحث.
            </p>
          </div>
        </div>

        {/* Logo Image Uploader */}
        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <label className="block text-xs font-bold text-neutral-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>لوجو المتجر المخصص (Store Logo Image)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            {logoUrl ? (
              <div className="relative w-32 h-16 rounded-xl border border-neutral-300 bg-white p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs">
                <Image
                  src={logoUrl}
                  alt="Store Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="w-32 h-16 rounded-xl border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center justify-center text-neutral-400 flex-shrink-0">
                <ImageIcon className="w-5 h-5 mb-1" />
                <span className="text-[10px]">لا يوجد لوجو</span>
              </div>
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  onClick={onUploadLogoClick}
                  className="gap-1.5 text-xs font-bold cursor-pointer"
                >
                  {uploadingLogo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{uploadingLogo ? "جاري الرفع لـ Cloudinary..." : "رفع لوجو جديد (Cloudinary)"}</span>
                </Button>

                {logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogoUrl("")}
                    className="text-rose-600 hover:bg-rose-50 text-xs gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف اللوجو</span>
                  </Button>
                )}
              </div>

              <input
                type="text"
                dir="ltr"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="أو الصق رابط صورة اللوجو مباشرة (https://...)"
                className="w-full p-2 rounded-lg border border-neutral-200 text-xs font-mono bg-white"
              />
              <p className="text-[10px] text-neutral-500">
                إذا تركت الحقل فارغاً، سيتم تلقائياً استخدام الشعار النصي الأنيق باسم المتجر.
              </p>
            </div>
          </div>
        </div>

        {/* Store Description */}
        <div className="space-y-1.5 pt-4 border-t border-neutral-100">
          <label className="block text-xs font-bold text-neutral-800">
            نبذة عن المتجر (Store About / Bio)
          </label>
          <textarea
            rows={3}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            placeholder="نبذة تشرح تميز خامات ومنتجات المتجر للعملاء في أسفل الموقع..."
            className="w-full p-3 rounded-xl border border-neutral-300 text-xs leading-relaxed bg-neutral-50 focus:bg-white transition"
          />
          <p className="text-[11px] text-neutral-500">
            تظهر هذه النبذة في فوتر الموقع الرئيسي وتعزز ثقة العملاء وسيو المتجر.
          </p>
        </div>
      </Card>
    </div>
  );
}
