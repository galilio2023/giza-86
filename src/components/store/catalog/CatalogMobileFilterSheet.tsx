"use client";

import { Check, Tag } from "lucide-react";
import { CategoryItem } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface CatalogMobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filteredCount: number;
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

export function CatalogMobileFilterSheet({
  open,
  onOpenChange,
  filteredCount,
  categories,
  selectedCategory,
  onSelectCategory,
  allSizes,
  selectedSize,
  onSelectSize,
  onlySale,
  onToggleSale,
  onResetFilters,
}: CatalogMobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col p-0">
        <SheetHeader className="p-5 border-b border-neutral-100 text-right">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-black text-neutral-900">تصفية المنتجات</SheetTitle>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-amber-700 font-bold underline cursor-pointer"
            >
              إعادة ضبط
            </button>
          </div>
          <p className="text-xs text-neutral-500 pt-0.5">
            مطابق حالياً: <strong className="text-neutral-900">{filteredCount}</strong> منتج
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Sale Switch */}
          <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/60">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-xs font-black text-rose-700 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                عرض التخفيضات والخصومات فقط 🔥
              </span>
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => onToggleSale(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300 cursor-pointer"
              />
            </label>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-neutral-900">الأقسام والتصنيفات</h4>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory("all")}
                className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-800"
                }`}
              >
                <span>كافة الأقسام</span>
                {selectedCategory === "all" && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              {categories
                .filter((c) => !c.parentId || c.parentId === null)
                .map((parent) => {
                  const isParentSelected = selectedCategory === parent.slug;
                  const hasChildren = Boolean(parent.children && parent.children.length > 0);

                  return (
                    <div key={parent.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => onSelectCategory(parent.slug)}
                        className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-between cursor-pointer ${
                          isParentSelected
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-900"
                        }`}
                      >
                        <span>{parent.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] opacity-70">({parent.productsCount ?? 0})</span>
                          {isParentSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                      </button>

                      {hasChildren && (
                        <div className="mr-3 pr-2 border-r-2 border-neutral-200 space-y-1">
                          {parent.children?.map((child) => {
                            const isChildSelected = selectedCategory === child.slug;
                            return (
                              <button
                                type="button"
                                key={child.id}
                                onClick={() => onSelectCategory(child.slug)}
                                className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                                  isChildSelected
                                    ? "bg-amber-100 text-amber-950 font-bold"
                                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                                }`}
                              >
                                <span>↳ {child.name}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] opacity-60">({child.productsCount ?? 0})</span>
                                  {isChildSelected && <Check className="w-3 h-3 text-amber-600" />}
                                </div>
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

          {/* Size */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-neutral-900">المقاسات</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectSize("all")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedSize === "all"
                    ? "bg-amber-500 text-neutral-950 shadow-xs"
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedSize === s
                      ? "bg-amber-500 text-neutral-950 shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Confirmation Bar */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/80">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>تطبيق الفلاتر (عرض {filteredCount} منتج)</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
