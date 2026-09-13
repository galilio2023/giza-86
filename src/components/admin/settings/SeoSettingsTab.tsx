"use client";

import React from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SeoSettingsTabProps {
  storeName: string;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  seoKeywords: string;
  setSeoKeywords: (val: string) => void;
}

export function SeoSettingsTab({
  storeName,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
}: SeoSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="space-y-6">
        <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <Search className="w-5 h-5 text-amber-600" />
          <span>إعدادات محركات البحث ووسوم الميتا (SEO & Meta Tags)</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              شعار العنوان في محرك البحث (SEO Title Slogan)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="متجر الأزياء والقطن المصري الفاخر"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white transition"
            />
            <p className="text-[11px] text-neutral-500">
              يظهر في عنوان الصفحة على جوجل بهذا التنسيق: <code>{storeName} - {seoTitle}</code>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              الوصف التعريفي لمحركات البحث (Meta Description)
            </label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="تسوق تشكيلة الأزياء الكاجوال والأوفر سايز والهوديز المصنوعة من أفخر قطن مصري..."
              className="w-full p-3 rounded-xl border border-neutral-300 text-xs leading-relaxed bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              الكلمات الدلالية المفتاحية (SEO Keywords - مفصولة بفواصل)
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="قطن مصري, أزياء رجالي, ملابس كاجوال, أوفر سايز, هوديز, قمصان كتان, إنستاباي, فودافون كاش"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50 focus:bg-white transition"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
