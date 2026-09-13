"use client";

import React from "react";
import Image from "next/image";
import { LayoutTemplate, Sparkles, Image as ImageIcon, Upload, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface HeroSettingsTabProps {
  heroBadge: string;
  setHeroBadge: (val: string) => void;
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  heroBgImage: string;
  setHeroBgImage: (val: string) => void;
  heroPrimaryBtnText: string;
  setHeroPrimaryBtnText: (val: string) => void;
  heroPrimaryBtnLink: string;
  setHeroPrimaryBtnLink: (val: string) => void;
  uploadingHeroBg: boolean;
  onUploadHeroBgClick: () => void;
}

export function HeroSettingsTab({
  heroBadge,
  setHeroBadge,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  heroBgImage,
  setHeroBgImage,
  heroPrimaryBtnText,
  setHeroPrimaryBtnText,
  heroPrimaryBtnLink,
  setHeroPrimaryBtnLink,
  uploadingHeroBg,
  onUploadHeroBgClick,
}: HeroSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-600" />
            <span>إدارة واجهة الهيرو الرئيسية (Hero Section CMS)</span>
          </h2>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            واجهة متجرك الأولى للزوار
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>نص الشارة العلوية (Hero Badge Text)</span>
            </label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="مثال: تشكيلة 2026 - قطن مصري فاخر"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              العنوان الرئيسي الكبير (Hero Title)
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="مثال: أزياء عصرية راقية"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-black bg-neutral-50 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-800">
            الوصف التفصيلي للهيرو (Hero Subtitle / Description)
          </label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="اكتشف تشكيلة التيشيرتات الأوفر سايز، الهوديز، والقمصان الكتان..."
            className="w-full p-3 rounded-xl border border-neutral-300 text-xs leading-relaxed bg-neutral-50 focus:bg-white transition"
          />
        </div>

        {/* Hero Background Image */}
        <div className="space-y-3 pt-4 border-t border-neutral-100">
          <label className="block text-xs font-bold text-neutral-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>صورة خلفية استوديو الهيرو (Hero Background Image)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            {heroBgImage ? (
              <div className="relative w-44 h-24 rounded-xl border border-neutral-300 bg-neutral-900 overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src={heroBgImage}
                  alt="Hero Background"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-44 h-24 rounded-xl border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center justify-center text-neutral-400 flex-shrink-0">
                <ImageIcon className="w-6 h-6 mb-1" />
                <span className="text-[10px]">الخلفية الافتراضية</span>
              </div>
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingHeroBg}
                  onClick={onUploadHeroBgClick}
                  className="gap-1.5 text-xs font-bold cursor-pointer"
                >
                  {uploadingHeroBg ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>{uploadingHeroBg ? "جاري الرفع لـ Cloudinary..." : "رفع خلفية جديدة (Cloudinary)"}</span>
                </Button>

                {heroBgImage && heroBgImage !== STORE_DEFAULTS.heroBgImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setHeroBgImage(STORE_DEFAULTS.heroBgImage)}
                    className="text-neutral-600 hover:bg-neutral-100 text-xs gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضية</span>
                  </Button>
                )}
              </div>

              <input
                type="text"
                dir="ltr"
                value={heroBgImage}
                onChange={(e) => setHeroBgImage(e.target.value)}
                placeholder="رابط صورة الخلفية (https://... أو /images/hero-bg.jpg)"
                className="w-full p-2 rounded-lg border border-neutral-200 text-xs font-mono bg-white"
              />
              <p className="text-[10px] text-neutral-500">
                يفضل صورة عريضة عالية الجودة بنسبة 16:9 أو 21:9 وتنسيق WEBP أو JPG.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              نص زر التسوق الأساسي
            </label>
            <input
              type="text"
              value={heroPrimaryBtnText}
              onChange={(e) => setHeroPrimaryBtnText(e.target.value)}
              placeholder="تسوق الكولكشن"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              رابط زر التسوق الأساسي
            </label>
            <input
              type="text"
              dir="ltr"
              value={heroPrimaryBtnLink}
              onChange={(e) => setHeroPrimaryBtnLink(e.target.value)}
              placeholder="/products"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-mono text-left bg-neutral-50 focus:bg-white transition"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
