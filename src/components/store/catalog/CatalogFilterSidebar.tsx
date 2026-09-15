"use client";

import { Filter, RotateCcw, Tag } from "lucide-react";
import { CategoryItem } from "@/types";

interface CatalogFilterSidebarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  allSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onlySale: boolean;
  onToggleSale: (checked: boolean) => void;
  onResetFilters: () => void;
}

export function CatalogFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  allSizes,
  selectedSize,
  onSelectSize,
  onlySale,
  onToggleSale,
  onResetFilters,
}: CatalogFilterSidebarProps) {
  return (
    <aside className="hidden lg:block space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-700" />
            فلترة المنتجات
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة ضبط
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-neutral-900">الأقسام والتصنيفات</h4>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              كافة الأقسام
            </button>

            {categories
              .filter((c) => !c.parentId || c.parentId === null)
              .map((parent) => {
                const isParentSelected = selectedCategory === parent.slug;
                const hasChildren = Boolean(parent.children && parent.children.length > 0);

                return (
                  <div key={parent.id} className="space-y-0.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectCategory(parent.slug)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isParentSelected
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-neutral-900 hover:bg-neutral-100"
                      }`}
                    >
                      <span>{parent.name}</span>
                      <span className="text-[10px] opacity-70">({parent.productsCount ?? 0})</span>
                    </button>

                    {hasChildren && (
                      <div className="mr-3 pr-2 border-r border-neutral-200/80 space-y-0.5">
                        {parent.children?.map((child) => {
                          const isChildSelected = selectedCategory === child.slug;
                          return (
                            <button
                              type="button"
                              key={child.id}
                              onClick={() => onSelectCategory(child.slug)}
                              className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                                isChildSelected
                                  ? "bg-amber-100 text-amber-950 font-bold"
                                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                              }`}
                            >
                              <span>↳ {child.name}</span>
                              <span className="text-[10px] opacity-60">({child.productsCount ?? 0})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Sizes Filter */}
        <div className="space-y-2 border-t border-neutral-100 pt-4">
          <h4 className="text-xs font-bold text-neutral-900">المقاسات</h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onSelectSize("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedSize === "all"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              الكل
            </button>
            {allSizes.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => onSelectSize(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedSize === s
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Only Sale Switch */}
        <div className="border-t border-neutral-100 pt-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlySale}
              onChange={(e) => onToggleSale(e.target.checked)}
              className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 cursor-pointer"
            />
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              عرض التخفيضات والخصومات فقط
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
