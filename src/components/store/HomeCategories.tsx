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

  return (
    <section className="layout-container py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-neutral-200/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>تصنيفات المتجر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
            أقسام تشكيلة {cleanName}
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1.5 group transition-colors self-start sm:self-end"
        >
          <span>تصفح جميع المنتجات ({categories.reduce((acc, c) => acc + (c.productsCount || 0), 0)}+)</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative rounded-3xl aspect-[3/4] overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all duration-500 flex flex-col justify-between p-3.5"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {/* Editorial Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-90" />

            {/* Top Row: Quick Action */}
            <div className="relative z-10 flex items-center justify-end w-full">
              <span className="text-[10px] font-bold text-white/80 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                تسوق ←
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 text-right space-y-0.5">
              <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 min-h-[2.5rem] flex items-end">
                {cat.name}
              </h3>
              <span className="text-[11px] text-neutral-300 block font-medium">
                {cat.productsCount ?? 0} موديل
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
