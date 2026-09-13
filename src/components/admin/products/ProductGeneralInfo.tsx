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
  badgeText: string;
  onBadgeTextChange: (val: string) => void;
  price: string;
  onPriceChange: (val: string) => void;
  salePrice: string;
  onSalePriceChange: (val: string) => void;
  totalStock: number;
  selectedSizes: string[];
  customSizes?: string[];
  onToggleSize: (size: string) => void;
  onApplySizePreset: (preset: "apparel" | "pants" | "one-size") => void;
  onAddCustomSize: (size: string) => void;
  isFeatured: boolean;
  onToggleFeatured: (val: boolean) => void;
  isNew: boolean;
  onToggleNew: (val: boolean) => void;
  hasSizeGuide: boolean;
  onToggleSizeGuide: (val: boolean) => void;
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
  badgeText,
  onBadgeTextChange,
  price,
  onPriceChange,
  salePrice,
  onSalePriceChange,
  totalStock,
  selectedSizes,
  customSizes = [],
  onToggleSize,
  onApplySizePreset,
  onAddCustomSize,
  isFeatured,
  onToggleFeatured,
  isNew,
  onToggleNew,
  hasSizeGuide,
  onToggleSizeGuide,
}: ProductGeneralInfoProps) {
  const [newSizeInput, setNewSizeInput] = React.useState("");

  const allDisplaySizes = Array.from(new Set([...AVAILABLE_SIZES, ...customSizes]));

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeInput.trim()) return;
    onAddCustomSize(newSizeInput.trim());
    setNewSizeInput("");
  };

  const BADGE_PRESETS = [
    "قطن جيزة 86 🇪🇬",
    "إكسسوار حصري ✨",
    "جلد طبيعي 💼",
    "صناعة يدوية 🧵",
    "افتراضي (شارة القسم)",
  ];

  const MATERIAL_PRESETS = [
    "قطن مصري 100% فاخر معالج ضد الانكماش والوبر",
    "أكريليك فاخر مع معدن مقاوم للصدأ",
    "جلد طبيعي ناعم فائق الجودة",
    "قماش كانفاس قطني متين وعالي التحمل",
  ];

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
            placeholder="مثال: تيشيرت أوفر سايز، حقيبة يد كاجوال، توكة شعر حرير..."
            className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">القسم والتصنيف</label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-base lg:text-sm font-bold"
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
            placeholder="product-slug-modanil"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-left text-base lg:text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">كود الصنف (SKU)</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="SKU-8492"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-left uppercase text-base lg:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">الوصف التفصيلي</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="وصف تفصيلي للقصة والستايل أو مواصفات الإكسسوار..."
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm"
        />
      </div>

      {/* Fabric / Material Details */}
      <div className="space-y-1.5">
        <label className="block font-bold text-neutral-800">
          مواصفات الخامة والمواد (اختياري)
        </label>
        <input
          type="text"
          value={fabricDetails}
          onChange={(e) => onFabricDetailsChange(e.target.value)}
          placeholder="مثال: قطن مصري 100%، جلد طبيعي، أكريليك متين..."
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm"
        />
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <span className="text-[10px] text-neutral-500 font-medium self-center ml-1">اقتراحات سريعة:</span>
          {MATERIAL_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => onFabricDetailsChange(preset)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
            >
              {preset.split(" ")[0]} {preset.split(" ")[1]}...
            </button>
          ))}
          {fabricDetails && (
            <button
              type="button"
              onClick={() => onFabricDetailsChange("")}
              className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 transition font-bold"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* Product Custom Badge */}
      <div className="space-y-1.5">
        <label className="block font-bold text-neutral-800">
          شارة المنتج المميزة على البطاقة (Badge)
        </label>
        <input
          type="text"
          value={badgeText}
          onChange={(e) => onBadgeTextChange(e.target.value)}
          placeholder="اترك فارغاً للاعتماد على شارة القسم، أو اكتب شارة مخصصة مثل: قطن مصري فاخر 🇪🇬 أو إكسسوار حصري ✨"
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm font-bold"
        />
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <span className="text-[10px] text-neutral-500 font-medium self-center ml-1">شارات مقترحة:</span>
          {BADGE_PRESETS.map((badge) => (
            <button
              type="button"
              key={badge}
              onClick={() => onBadgeTextChange(badge === "افتراضي (شارة القسم)" ? "" : badge)}
              className={`text-[10px] px-2 py-0.5 rounded-md border transition font-bold ${
                (badge === "افتراضي (شارة القسم)" && !badgeText) || badgeText === badge
                  ? "bg-amber-500 text-neutral-950 border-amber-600"
                  : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
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
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-base lg:text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">سعر الخصم (ج.م - اختياري)</label>
          <input
            type="number"
            value={salePrice}
            onChange={(e) => onSalePriceChange(e.target.value)}
            placeholder="380"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-base lg:text-sm"
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
            className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-100 font-mono text-base lg:text-sm text-neutral-500 font-bold cursor-not-allowed"
          />
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            مجموع كميات المتغيرات بالأسفل
          </span>
        </div>
      </div>

      {/* Sizes Selection */}
      <div className="space-y-2 border-t border-neutral-100 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block font-bold text-neutral-800">المقاسات المتوفرة:</label>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-neutral-400 font-medium">أنماط سريعة:</span>
            <button
              type="button"
              onClick={() => onApplySizePreset("one-size")}
              className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold transition cursor-pointer"
            >
              مقاس موحد (One Size)
            </button>
            <button
              type="button"
              onClick={() => onApplySizePreset("apparel")}
              className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-medium transition cursor-pointer"
            >
              ملابس (S-2XL)
            </button>
            <button
              type="button"
              onClick={() => onApplySizePreset("pants")}
              className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-medium transition cursor-pointer"
            >
              بناطيل (30-36)
            </button>
          </div>
        </div>

        {/* Size Pills */}
        <div className="flex flex-wrap gap-2">
          {allDisplaySizes.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => onToggleSize(s)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                selectedSizes.includes(s)
                  ? "bg-amber-500 text-neutral-950 border-amber-600 shadow-xs"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Add Custom Size Form */}
        <div className="flex items-center gap-2 pt-1 max-w-sm">
          <input
            type="text"
            value={newSizeInput}
            onChange={(e) => setNewSizeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom(e);
              }
            }}
            placeholder="إضافة مقاس مخصص (مثال: Free Size، 4XL، 35 سم)..."
            className="p-1.5 px-3 rounded-lg border border-neutral-200 text-base lg:text-sm flex-1 min-h-[38px]"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition min-h-[38px]"
          >
            + إضافة
          </button>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 border-t border-neutral-100">
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

        <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
          <input
            type="checkbox"
            checked={hasSizeGuide}
            onChange={(e) => onToggleSizeGuide(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 accent-amber-600"
          />
          <span>تفعيل جدول مقاسات الملابس بالسنتيمتر (Size Guide)</span>
        </label>
      </div>
    </div>
  );
}
