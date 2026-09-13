import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ArrowLeft, Flame, Sparkles } from "lucide-react";
import { ProductItem, CategoryItem } from "@/types";
import { formatEGP } from "@/lib/utils";

interface HeroLookbookProps {
  products?: ProductItem[];
  categories?: CategoryItem[];
}

const FALLBACK_HERO_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "تيشيرت أوفر سايز قطن مصري فاخر",
    slug: "oversized-tshirt-black",
    description: "قطن مصري 100% معالج ضد الانكماش بقصة أوفر سايز عصرية مريحة 240 GSM",
    fabricDetails: "قطن مصري أصيل • 240 GSM",
    price: 450,
    salePrice: 380,
    stock: 12,
    categoryId: 1,
    categoryName: "أوفر سايز",
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "أسود فاحم", hex: "#0a0a0a" }],
    images: ["/images/hero-model.jpg"],
    isFeatured: true,
  },
  {
    id: 2,
    name: "هودي ثقيل مبطن ميلتون شتوي",
    slug: "winter-fleece-hoodie",
    description: "ميلتون قطني 320 GSM معالج ومبطن بفرو ناعم للدفء والأناقة",
    fabricDetails: "ميلتون شتوي ثقيل",
    price: 680,
    salePrice: 590,
    stock: 8,
    categoryId: 2,
    categoryName: "هوديز وسويت شيرت",
    sizes: ["M", "L", "XL", "2XL"],
    colors: [{ name: "رمادي ميلانج", hex: "#888888" }],
    images: ["/images/hero-hoodie.jpg"],
    isFeatured: true,
  },
  {
    id: 3,
    name: "قميص كتان طبيعي صيفي كاجوال",
    slug: "linen-casual-shirt",
    description: "كتان طبيعي ناعم ومسامي مناسب للأجواء الحارة وخروجات المساء",
    fabricDetails: "كتان طبيعي 100%",
    price: 520,
    salePrice: undefined,
    stock: 10,
    categoryId: 3,
    categoryName: "قمصان كاجوال",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "أبيض ناصع", hex: "#ffffff" }],
    images: ["/images/hero-shirt.jpg"],
    isFeatured: true,
  },
];

const FALLBACK_CATEGORIES = [
  { id: 1, name: "أوفر سايز وتيشيرتات", slug: "oversized-tshirts" },
  { id: 2, name: "هوديز وسويت شيرت", slug: "hoodies-sweatshirts" },
  { id: 3, name: "قمصان كاجوال وكتان", slug: "casual-shirts" },
  { id: 4, name: "بناطيل وسويت بانتس", slug: "pants-sweatpants" },
];

export function HeroLookbook({ products = [], categories = [] }: HeroLookbookProps = {}) {
  // Smart Hybrid: Use provided products (featured/bestsellers) or fallback if empty
  const activeProducts = products.length > 0 ? products : FALLBACK_HERO_PRODUCTS;

  const prod1 = activeProducts[0] || FALLBACK_HERO_PRODUCTS[0];
  const prod2 = activeProducts[1] || FALLBACK_HERO_PRODUCTS[1];
  const prod3 = activeProducts[2] || FALLBACK_HERO_PRODUCTS[2];

  const quickCategories =
    categories.length > 0
      ? categories.slice(0, 4)
      : FALLBACK_CATEGORIES;

  // Primary card details
  const prod1Image = prod1.images?.[0] || "/images/hero-model.jpg";
  const prod1HasSale = prod1.salePrice !== undefined && prod1.salePrice !== null && prod1.salePrice < prod1.price;
  const prod1Discount = prod1HasSale
    ? Math.round(((prod1.price - Number(prod1.salePrice)) / prod1.price) * 100)
    : 0;

  // Secondary card 1 details
  const prod2Image = prod2.images?.[0] || "/images/hero-hoodie.jpg";
  const prod2HasSale = prod2.salePrice !== undefined && prod2.salePrice !== null && prod2.salePrice < prod2.price;
  const prod2Discount = prod2HasSale
    ? Math.round(((prod2.price - Number(prod2.salePrice)) / prod2.price) * 100)
    : 0;

  // Secondary card 2 details
  const prod3Image = prod3.images?.[0] || "/images/hero-shirt.jpg";
  const prod3HasSale = prod3.salePrice !== undefined && prod3.salePrice !== null && prod3.salePrice < prod3.price;
  const prod3Discount = prod3HasSale
    ? Math.round(((prod3.price - Number(prod3.salePrice)) / prod3.price) * 100)
    : 0;

  // Real product cards link to canonical slug or id; fallback synthetic cards route to /products
  const prod1Href = products[0]
    ? `/products/${encodeURIComponent(prod1.slug || String(prod1.id))}`
    : "/products";
  const prod2Href = products[1]
    ? `/products/${encodeURIComponent(prod2.slug || String(prod2.id))}`
    : "/products";
  const prod3Href = products[2]
    ? `/products/${encodeURIComponent(prod3.slug || String(prod3.id))}`
    : "/products";

  return (
    <div className="lg:col-span-6 space-y-3 sm:space-y-4">
      {/* Editorial Lookbook Header */}
      <div className="flex items-center justify-between px-1 sm:px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-900 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>قطع الموسم الأكثر طلباً</span>
          </span>
        </div>
        <Link
          href="/products"
          className="text-[11px] sm:text-xs font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-0.5 transition-colors"
        >
          <span>تصفح الكتالوج بالكامل</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Lookbook Cards Asymmetric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 h-auto sm:h-[440px] lg:h-[480px]">
        {/* Primary Feature Product Card */}
        <Link
          href={prod1Href}
          className="group relative sm:col-span-7 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 hover:border-amber-400/50 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-end h-[260px] sm:h-full cursor-pointer"
        >
          <Image
            src={prod1Image}
            alt={prod1.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
              {prod1.categoryName || "تشكيلة حصرية"}
            </span>

            {prod1HasSale ? (
              <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-300" />
                <span>خصم {prod1Discount}%</span>
              </span>
            ) : prod1.badgeText ? (
              <span className="bg-amber-500 text-neutral-950 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                {prod1.badgeText}
              </span>
            ) : (
              <span className="bg-amber-500 text-neutral-950 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                الأكثر طلباً
              </span>
            )}
          </div>

          {/* Bottom Product Info & Price */}
          <div className="relative z-10 p-4 sm:p-5 text-right space-y-1.5 text-white">
            <p className="text-[10px] sm:text-[11px] text-amber-300 font-bold tracking-wide">
              {prod1.fabricDetails || prod1.description.slice(0, 35)}
            </p>
            <h3 className="text-base sm:text-xl font-black text-white group-hover:text-amber-200 transition-colors line-clamp-1">
              {prod1.name}
            </h3>

            <div className="pt-1 flex items-center justify-between">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-black text-amber-400">
                  {formatEGP(prod1.salePrice ?? prod1.price)}
                </span>
                {prod1HasSale && (
                  <span className="line-through text-white/50 text-xs font-medium">
                    {formatEGP(prod1.price)}
                  </span>
                )}
              </div>

              {/* Direct View CTA Pill */}
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors text-[11px] sm:text-xs font-bold text-white">
                <span>عرض القطعة</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        {/* Secondary Column: 2 Stacked Product Cards */}
        <div className="sm:col-span-5 grid grid-cols-2 sm:flex sm:flex-col gap-3 sm:gap-4 h-full">
          {/* Secondary Card 1 */}
          <Link
            href={prod2Href}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 hover:border-amber-400/50 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-end h-[160px] sm:h-auto sm:flex-1 sm:min-h-0 cursor-pointer"
          >
            <Image
              src={prod2Image}
              alt={prod2.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2.5 right-2.5 z-10">
              {prod2HasSale ? (
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                  خصم {prod2Discount}%
                </span>
              ) : (
                <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                  {prod2.categoryName || "مميز"}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="relative z-10 p-2.5 sm:p-4 text-right space-y-0.5 text-white">
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-bold truncate">
                {prod2.fabricDetails || prod2.categoryName || "تشكيلة حصرية"}
              </p>
              <h3 className="text-xs sm:text-base font-black text-white group-hover:text-amber-200 transition-colors truncate">
                {prod2.name}
              </h3>
              <div className="pt-0.5 flex items-center justify-between gap-1">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-amber-400 font-black text-xs sm:text-sm whitespace-nowrap">
                    {formatEGP(prod2.salePrice ?? prod2.price)}
                  </span>
                  {prod2HasSale && (
                    <span className="line-through text-white/50 text-[10px] font-medium whitespace-nowrap hidden min-[380px]:inline">
                      {formatEGP(prod2.price)}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-0.5 bg-white/15 backdrop-blur-xs px-2 py-0.5 rounded-full text-white/90 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors text-[10px] font-bold flex-shrink-0">
                  <span className="hidden min-[360px]:inline">عرض</span>
                  <ArrowLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary Card 2 */}
          <Link
            href={prod3Href}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 hover:border-amber-400/50 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-end h-[160px] sm:h-auto sm:flex-1 sm:min-h-0 cursor-pointer"
          >
            <Image
              src={prod3Image}
              alt={prod3.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2.5 right-2.5 z-10">
              {prod3HasSale ? (
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                  خصم {prod3Discount}%
                </span>
              ) : (
                <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                  {prod3.categoryName || "مميز"}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="relative z-10 p-2.5 sm:p-4 text-right space-y-0.5 text-white">
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-bold truncate">
                {prod3.fabricDetails || prod3.categoryName || "تشكيلة حصرية"}
              </p>
              <h3 className="text-xs sm:text-base font-black text-white group-hover:text-amber-200 transition-colors truncate">
                {prod3.name}
              </h3>
              <div className="pt-0.5 flex items-center justify-between gap-1">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-amber-400 font-black text-xs sm:text-sm whitespace-nowrap">
                    {formatEGP(prod3.salePrice ?? prod3.price)}
                  </span>
                  {prod3HasSale && (
                    <span className="line-through text-white/50 text-[10px] font-medium whitespace-nowrap hidden min-[380px]:inline">
                      {formatEGP(prod3.price)}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-0.5 bg-white/15 backdrop-blur-xs px-2 py-0.5 rounded-full text-white/90 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors text-[10px] font-bold flex-shrink-0">
                  <span className="hidden min-[360px]:inline">عرض</span>
                  <ArrowLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Department Tags (Browse by Category) */}
      <div className="hidden sm:flex items-center justify-between p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-xs text-xs">
        <span className="text-neutral-500 font-bold whitespace-nowrap">تصفح الأقسام:</span>
        <div className="flex items-center gap-2 flex-wrap">
          {quickCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
