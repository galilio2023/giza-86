"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { CategoryItem } from "@/types";

interface CatalogActiveFiltersProps {
  selectedCategory: string;
  selectedSize: string;
  onlySale: boolean;
  queryParam: string | null;
  wishlistParam: string | null;
  categories: CategoryItem[];
  onCategoryReset: () => void;
  onSizeReset: () => void;
  onSaleReset: () => void;
  onResetAll: () => void;
}

export function CatalogActiveFilters({
  selectedCategory,
  selectedSize,
  onlySale,
  queryParam,
  wishlistParam,
  categories,
  onCategoryReset,
  onSizeReset,
  onSaleReset,
  onResetAll,
}: CatalogActiveFiltersProps) {
  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSize !== "all" ||
    onlySale ||
    queryParam ||
    wishlistParam === "true";

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap pt-4">
      <span className="text-xs text-neutral-500 font-bold">الفلاتر المطبقة:</span>

      {selectedCategory !== "all" && (
        <button
          type="button"
          onClick={onCategoryReset}
          className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-neutral-800 transition cursor-pointer"
        >
          <span>القسم: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
          <X className="w-3 h-3 text-neutral-300" />
        </button>
      )}

      {selectedSize !== "all" && (
        <button
          type="button"
          onClick={onSizeReset}
          className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-neutral-800 transition cursor-pointer"
        >
          <span>المقاس: {selectedSize}</span>
          <X className="w-3 h-3 text-neutral-300" />
        </button>
      )}

      {onlySale && (
        <button
          type="button"
          onClick={onSaleReset}
          className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-rose-700 transition cursor-pointer"
        >
          <span>العروض والتخفيضات 🔥</span>
          <X className="w-3 h-3 text-rose-200" />
        </button>
      )}

      {queryParam && (
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 bg-neutral-200 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full hover:bg-neutral-300 transition"
        >
          <span>بحث: &ldquo;{queryParam}&rdquo;</span>
          <X className="w-3 h-3" />
        </Link>
      )}

      {wishlistParam === "true" && (
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full hover:bg-rose-200 transition"
        >
          <span>المفضلة ❤️</span>
          <X className="w-3 h-3" />
        </Link>
      )}

      <button
        type="button"
        onClick={onResetAll}
        className="text-xs text-neutral-700 hover:text-neutral-950 font-bold underline mr-2 cursor-pointer"
      >
        إعادة ضبط الكل
      </button>
    </div>
  );
}
