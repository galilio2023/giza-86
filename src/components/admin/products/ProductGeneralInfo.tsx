"use client";

import React from "react";
import { CategoryItem } from "@/types";
import { AVAILABLE_SIZES } from "@/hooks/useProductVariantsForm";

export interface ProductGeneralInfoProps {
  name: string;
  onNameChange: (val: string) => void;
  categoryId: number;
  onCategoryChange: (val: number) => void;
  categories: CategoryItem[];
  slug: string;
  onSlugChange: (val: string) => void;
  sku: string;
  onSkuChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  fabricDetails: string;
  onFabricDetailsChange: (val: string) => void;
  price: string;
  onPriceChange: (val: string) => void;
  salePrice: string;
  onSalePriceChange: (val: string) => void;
  totalStock: number;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  isFeatured: boolean;
  onToggleFeatured: (val: boolean) => void;
  isNew: boolean;
  onToggleNew: (val: boolean) => void;
}

export function ProductGeneralInfo({
  name,
  onNameChange,
  categoryId,
  onCategoryChange,
  categories,
  slug,
  onSlugChange,
  sku,
  onSkuChange,
  description,
  onDescriptionChange,
  fabricDetails,
  onFabricDetailsChange,
  price,
  onPriceChange,
  salePrice,
  onSalePriceChange,
  totalStock,
  selectedSizes,
  onToggleSize,
  isFeatured,
  onToggleFeatured,
  isNew,
  onToggleNew,
}: ProductGeneralInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block font-bold text-neutral-800 mb-1">اسم المنتج *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="مثال: تيشيرت أوفر سايز قطن مصري"
            className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">القسم والتصنيف</label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-neutral-800 mb-1">الرابط الدائم (Slug)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="oversized-tee-giza86"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-left text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">كود الصنف (SKU)</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="SKU-8492"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-left uppercase text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">الوصف التفصيلي</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="وصف تفصيلي للقصة والستايل..."
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
        />
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">
          مواصفات الخامة والقطن المصري
        </label>
        <input
          type="text"
          value={fabricDetails}
          onChange={(e) => onFabricDetailsChange(e.target.value)}
          placeholder="مثال: قطن مصري 100% - وزن 240 جرام - معالج ضد الانكماش"
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold text-neutral-800 mb-1">السعر الأساسي (ج.م) *</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="490"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">سعر الخصم (ج.م - اختياري)</label>
          <input
            type="number"
            value={salePrice}
            onChange={(e) => onSalePriceChange(e.target.value)}
            placeholder="380"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">
            إجمالي المخزون (تلقائي)
          </label>
          <input
            type="number"
            readOnly
            value={totalStock}
            placeholder="0"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono bg-neutral-100/70 text-neutral-800 font-bold cursor-not-allowed text-xs"
          />
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            مجموع كميات المتغيرات بالأسفل
          </span>
        </div>
      </div>

      {/* Sizes Selection */}
      <div>
        <label className="block font-bold text-neutral-800 mb-1.5">المقاسات المتوفرة:</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => onToggleSize(s)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                selectedSizes.includes(s)
                  ? "bg-amber-500 text-neutral-950 border-amber-600"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => onToggleFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 accent-amber-600"
          />
          <span>تمييز في الصفحة الرئيسية (Featured)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => onToggleNew(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 accent-amber-600"
          />
          <span>إظهار شارة (جديد)</span>
        </label>
      </div>
    </div>
  );
}
