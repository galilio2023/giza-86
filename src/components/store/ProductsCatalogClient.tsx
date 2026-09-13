"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown, Loader2 } from "lucide-react";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { ProductItem, CategoryItem } from "@/types";
import { useWishlistStore } from "@/lib/wishlist-store";
import {
  CatalogActiveFilters,
  CatalogFilterSidebar,
  CatalogMobileFilterSheet,
  CatalogProductsGrid,
} from "./catalog";

interface Props {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
}

const ALL_SIZES = ["مقاس موحد", "One Size", "S", "M", "L", "XL", "2XL", "3XL", "30", "32", "34", "36", "38", "50", "52"];

export function ProductsCatalogClient({
  initialProducts,
  categories,
  totalCount,
  currentPage = 1,
  pageSize = 24,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const onSaleParam = searchParams.get("onSale");
  const sizeParam = searchParams.get("size");
  const queryParam = searchParams.get("q");
  const wishlistParam = searchParams.get("wishlist");
  const sortParam = (searchParams.get("sort") as "newest" | "price-asc" | "price-desc") || "newest";

  // Non-blocking transition state
  const [isPending, startTransition] = useTransition();

  // Derived filter states from URL (Single Source of Truth)
  const selectedCategory = categoryParam || "all";
  const selectedSize = sizeParam || "all";
  const onlySale = onSaleParam === "true";
  const sortBy = sortParam;
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  const wishlist = useWishlistStore((state) => state.wishlist);

  // Filter Logic: Server already filters category, onSale, size, and search.
  // We only filter wishlist client-side if requested (wishlist is stored in browser localStorage).
  const filteredProducts = wishlistParam === "true"
    ? initialProducts.filter((p) => wishlist.includes(p.id))
    : initialProducts;

  const total = totalCount ?? initialProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const updateUrlFilters = (updates: {
    category?: string;
    size?: string;
    onSale?: boolean;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.category !== undefined) {
      if (updates.category === "all") params.delete("category");
      else params.set("category", updates.category);
    }
    if (updates.size !== undefined) {
      if (updates.size === "all") params.delete("size");
      else params.set("size", updates.size);
    }
    if (updates.onSale !== undefined) {
      if (!updates.onSale) params.delete("onSale");
      else params.set("onSale", "true");
    }
    if (updates.sort !== undefined) {
      if (updates.sort === "newest") params.delete("sort");
      else params.set("sort", updates.sort);
    }
    if (updates.page !== undefined) {
      if (updates.page <= 1) params.delete("page");
      else params.set("page", String(updates.page));
    } else {
      params.delete("page");
    }

    startTransition(() => {
      const q = params.toString();
      router.push(q ? `/products?${q}` : "/products", { scroll: false });
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push("/products", { scroll: false });
    });
  };

  const handleCategorySelect = (catSlug: string) => {
    updateUrlFilters({ category: catSlug });
  };

  const handleSizeSelect = (size: string) => {
    updateUrlFilters({ size });
  };

  const handleSortChange = (newSort: "newest" | "price-asc" | "price-desc") => {
    updateUrlFilters({ sort: newSort });
  };

  const handleSaleToggle = (checked: boolean) => {
    updateUrlFilters({ onSale: checked });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlFilters({ page: newPage });
  };

  return (
    <div>
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <Link href="/" className="hover:text-neutral-900">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-bold">المتجر</span>
            {wishlistParam === "true" && <span>/ المفضلة</span>}
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              {wishlistParam === "true"
                ? "قائمة المنتجات المفضلة"
                : queryParam
                ? `نتائج البحث عن: "${queryParam}"`
                : "جميع المنتجات والموديلات"}
            </h1>
            {isPending && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                تحديث...
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            عرض {filteredProducts.length} من أصل {total} قطعة
          </p>
        </div>

        {/* Sort selector & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>تصفية النتائج</span>
          </button>

          <div className="relative flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-500 hidden sm:inline">الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as "newest" | "price-asc" | "price-desc")}
              className="bg-transparent font-bold text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="newest">الأحدث وصولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <CatalogActiveFilters
        selectedCategory={selectedCategory}
        selectedSize={selectedSize}
        onlySale={onlySale}
        queryParam={queryParam}
        wishlistParam={wishlistParam}
        categories={categories}
        onCategoryReset={() => handleCategorySelect("all")}
        onSizeReset={() => handleSizeSelect("all")}
        onSaleReset={() => handleSaleToggle(false)}
        onResetAll={resetFilters}
      />

      {/* Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        <CatalogFilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          allSizes={ALL_SIZES}
          selectedSize={selectedSize}
          onSelectSize={handleSizeSelect}
          onlySale={onlySale}
          onToggleSale={handleSaleToggle}
          onResetFilters={resetFilters}
        />

        <CatalogProductsGrid
          products={filteredProducts}
          isPending={isPending}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onResetFilters={resetFilters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Filter Sheet */}
      <CatalogMobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        filteredCount={filteredProducts.length}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        allSizes={ALL_SIZES}
        selectedSize={selectedSize}
        onSelectSize={handleSizeSelect}
        onlySale={onlySale}
        onToggleSale={handleSaleToggle}
        onResetFilters={resetFilters}
      />
    </div>
  );
}
