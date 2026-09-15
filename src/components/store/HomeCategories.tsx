import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { CategoryItem } from "@/types";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface HomeCategoriesProps {
  categories: CategoryItem[];
  storeName?: string;
}

export function HomeCategories({ categories, storeName }: HomeCategoriesProps) {
  const cleanName = storeName || STORE_DEFAULTS.storeName || "MODANIL";

  // Isolate parent categories for clean top-level homepage presentation
  const topParents = categories.filter((c) => !c.parentId || c.parentId === null);
  const displayItems = topParents.length > 0 ? topParents : categories;

  // Calculate total without double-counting nested subcategories
  const totalProducts = displayItems.reduce((acc, c) => acc + (c.productsCount || 0), 0);

  return (
    <section className="layout-container py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-neutral-200/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>تصنيفات وتشكيلات المتجر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
            أقسام تشكيلة {cleanName}
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1.5 group transition-colors self-start sm:self-end"
        >
          <span>تصفح جميع المنتجات ({totalProducts > 0 ? `${totalProducts}+` : "الكل"})</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {displayItems.map((cat) => (
          <div
            key={cat.id}
            className="group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-5 min-h-[360px] sm:min-h-[420px]"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {/* Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-neutral-950/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-95" />

            {/* Top Row: Quick Direct Link */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {cat.productsCount ?? 0} موديل
              </span>
              <Link
                href={`/products?category=${cat.slug}`}
                className="text-[11px] font-bold text-white bg-white/20 hover:bg-amber-500 hover:text-neutral-950 backdrop-blur-md px-3 py-1 rounded-full transition-all duration-300"
              >
                تصفح القسم ←
              </Link>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 text-right space-y-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                  <Link href={`/products?category=${cat.slug}`}>
                    {cat.name}
                  </Link>
                </h3>
                {cat.description && (
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Nested Subcategories Quick Jump Chips */}
              {cat.children && cat.children.length > 0 && (
                <div className="pt-2 border-t border-white/15 flex flex-wrap gap-1.5">
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/products?category=${sub.slug}`}
                      className="text-[10px] font-semibold text-white/90 bg-white/15 hover:bg-amber-400 hover:text-neutral-950 px-2.5 py-1 rounded-lg backdrop-blur-sm transition-colors duration-200"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
