"use client";

import Image from "next/image";
import { Edit3, Trash2, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { CategoryItem } from "@/types";

interface CategoryGridProps {
  categories: CategoryItem[];
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
  onMove?: (category: CategoryItem, direction: "up" | "down") => void;
  isMoving?: boolean;
}

export function CategoryGrid({
  categories,
  onEdit,
  onDelete,
  onMove,
  isMoving = false,
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
        <Layers className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-800">لا توجد أقسام حالياً</h3>
        <p className="text-xs text-neutral-500 mt-1">ابدأ بإضافة أول قسم لتصنيف المنتجات</p>
      </div>
    );
  }

  // Ensure deterministic display order in admin view
  const sortedCategories = [...categories].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedCategories.map((cat, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedCategories.length - 1;

        return (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition group"
          >
            <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold text-neutral-800 shadow-xs flex items-center gap-1.5 border border-neutral-200/60">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>الترتيب: {cat.displayOrder ?? index + 1}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-lg text-neutral-900">{cat.name}</h3>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border">
                    /{cat.slug}
                  </span>
                </div>
                {cat.description && (
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                  {cat.productsCount ?? 0} منتجات مسجلة
                </span>

                <div className="flex items-center gap-1.5">
                  {onMove && (
                    <div className="flex items-center gap-1 bg-neutral-50 p-0.5 rounded-xl border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => onMove(cat, "up")}
                        disabled={isFirst || isMoving}
                        className="min-h-[32px] min-w-[32px] flex items-center justify-center p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-white rounded-lg transition disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                        title="تحريك للأعلى (تقديم الترتيب)"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(cat, "down")}
                        disabled={isLast || isMoving}
                        className="min-h-[32px] min-w-[32px] flex items-center justify-center p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-white rounded-lg transition disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                        title="تحريك للأسفل (تأخير الترتيب)"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onEdit(cat)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center p-2 text-neutral-600 hover:text-amber-700 hover:bg-neutral-100 rounded-xl transition border border-neutral-200 cursor-pointer"
                    title="تعديل القسم"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cat)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center p-2 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-xl transition border border-neutral-200 cursor-pointer"
                    title="حذف القسم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
