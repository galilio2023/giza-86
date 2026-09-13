"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { ProductItem } from "@/types";
import { Button } from "@/components/ui/button";

interface HomeProductsGridProps {
  products: ProductItem[];
}

export function HomeProductsGrid({ products }: HomeProductsGridProps) {
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "new" | "sale">("all");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "featured") return p.isFeatured;
    if (activeTab === "new") return p.isNew;
    if (activeTab === "sale") return p.salePrice && p.salePrice < p.price;
    return true;
  });

  return (
    <section className="layout-container section-spacing">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-neutral-200 pb-4 w-full min-w-0">
        <div>
          <span className="section-badge">
            مختارات الموسم
          </span>
          <h2 className="section-heading">
            أحدث موديلات الأزياء الكاجوال
          </h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/80 shadow-inner overflow-x-auto no-scrollbar w-full sm:w-auto max-w-full min-w-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "all"
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-white/70"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "featured"
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-white/70"
            }`}
          >
            المميز
          </button>
          <button
            onClick={() => setActiveTab("sale")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "sale"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-rose-600 hover:bg-white/70"
            }`}
          >
            تخفيضات 🔥
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "new"
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-white/70"
            }`}
          >
            وصل حديثاً
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 px-6 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
          <p className="text-base font-bold text-neutral-800">لا توجد منتجات ضمن هذا التصنيف حالياً</p>
          <p className="text-xs text-neutral-500 mt-1">تفضل بمراجعة باقي التشكيلات أو تصفح كاتالوج المتجر كاملاً</p>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className="mt-4 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition cursor-pointer"
          >
            عرض كافة المنتجات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 w-full min-w-0">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/products">
          <Button variant="primary" size="lg" className="gap-2 px-8">
            <span>مشاهدة كافة منتجات المتجر</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
