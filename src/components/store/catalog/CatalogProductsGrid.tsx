"use client";

import { Filter } from "lucide-react";
import { ProductItem } from "@/types";
import { ProductCard } from "@/components/store/ProductCard";
import { Pagination } from "@/components/ui/pagination";

interface CatalogProductsGridProps {
  products: ProductItem[];
  isPending: boolean;
  onQuickView: (product: ProductItem) => void;
  onResetFilters: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function CatalogProductsGrid({
  products,
  isPending,
  onQuickView,
  onResetFilters,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: CatalogProductsGridProps) {
  return (
    <div
      className={`lg:col-span-3 transition-opacity duration-200 ${
        isPending ? "opacity-60 pointer-events-none" : "opacity-100"
      }`}
    >
      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">
            لا توجد منتجات تطابق هذه الفلاتر
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            حاول إزالة بعض الفلاتر أو إعادة ضبط البحث للعثور على ما تبحث عنه.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isPending={isPending}
              variant="full"
            />
          )}
        </>
      )}
    </div>
  );
}
