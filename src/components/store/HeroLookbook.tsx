import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ArrowLeft } from "lucide-react";

export function HeroLookbook() {
  return (
    <div className="lg:col-span-6 space-y-3 sm:space-y-4">
      {/* Editorial Lookbook Header */}
      <div className="flex items-center justify-between px-1 sm:px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-900 font-mono">
            LOOKBOOK CURATION 2026
          </span>
        </div>
        <Link
          href="/products"
          className="text-[11px] sm:text-xs font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-0.5 transition-colors"
        >
          <span>جميع التصنيفات</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Lookbook Cards Asymmetric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 h-auto sm:h-[440px] lg:h-[480px]">
        {/* Primary Feature Card: Oversized Cotton Tees */}
        <Link
          href="/products?category=oversized-tshirts"
          className="group relative sm:col-span-7 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end h-[240px] sm:h-full"
        >
          <Image
            src="/images/hero-model.jpg"
            alt="تشكيلة أوفر سايز وتيشيرتات قطن مصري"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[9px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-full font-mono border border-white/10">
              01 • OVERSIZED
            </span>
            <span className="bg-amber-500 text-neutral-950 text-[9px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
              الأكثر طلباً
            </span>
          </div>

          {/* Bottom Card Info */}
          <div className="relative z-10 p-3.5 sm:p-5 text-right space-y-1 text-white">
            <p className="text-[10px] sm:text-[11px] text-amber-300 font-bold tracking-wide">
              قطن مصري أصيل • 240 GSM
            </p>
            <h3 className="text-base sm:text-xl font-black text-white group-hover:text-amber-200 transition-colors">
              أوفر سايز وتي شيرتات
            </h3>
            <div className="pt-1 sm:pt-2 flex items-center justify-between text-xs font-bold text-white/90">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-full group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors text-[11px] sm:text-xs">
                <span>استكشف التشكيلة</span>
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
              <span className="text-[10px] sm:text-[11px] text-white/70 font-mono">6 موديلات</span>
            </div>
          </div>
        </Link>

        {/* Secondary Column: 2 Stacked Category Cards */}
        <div className="sm:col-span-5 grid grid-cols-2 sm:flex sm:flex-col gap-3 sm:gap-4 h-full">
          {/* Secondary Card 1: Hoodies & Sweatshirts */}
          <Link
            href="/products?category=hoodies-sweatshirts"
            className="group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end h-[145px] sm:h-auto sm:flex-1 sm:min-h-0"
          >
            <Image
              src="/images/hero-hoodie.jpg"
              alt="تشكيلة هوديز وسويت شيرت شتوي"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[9px] font-black px-1.5 py-0.5 rounded-full font-mono border border-white/10">
                02 • FLEECE
              </span>
            </div>

            {/* Info */}
            <div className="relative z-10 p-2.5 sm:p-4 text-right space-y-0.5 text-white">
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-bold">ميلتون شتوي</p>
              <h3 className="text-xs sm:text-base font-black text-white group-hover:text-amber-200 transition-colors truncate">
                هوديز وسويت شيرت
              </h3>
              <div className="pt-0.5 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-white/90">
                <span className="inline-flex items-center gap-0.5 group-hover:text-amber-300 transition-colors">
                  <span>تسوق</span>
                  <ArrowLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary Card 2: Linen & Casual Shirts */}
          <Link
            href="/products?category=casual-shirts"
            className="group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end h-[145px] sm:h-auto sm:flex-1 sm:min-h-0"
          >
            <Image
              src="/images/hero-shirt.jpg"
              alt="تشكيلة قمصان كاجوال وكتان صيفي"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[9px] font-black px-1.5 py-0.5 rounded-full font-mono border border-white/10">
                03 • LINEN
              </span>
            </div>

            {/* Info */}
            <div className="relative z-10 p-2.5 sm:p-4 text-right space-y-0.5 text-white">
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-bold">كتان طبيعي</p>
              <h3 className="text-xs sm:text-base font-black text-white group-hover:text-amber-200 transition-colors truncate">
                قمصان كاجوال
              </h3>
              <div className="pt-0.5 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-white/90">
                <span className="inline-flex items-center gap-0.5 group-hover:text-amber-300 transition-colors">
                  <span>تسوق</span>
                  <ArrowLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Editorial Tags */}
      <div className="hidden sm:flex items-center justify-between p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-xs text-xs">
        <span className="text-neutral-500 font-bold whitespace-nowrap">تسوق سريع:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/products?category=pants-sweatpants"
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-colors whitespace-nowrap"
          >
            بناطيل وسويت بانتس
          </Link>
          <Link
            href="/products?category=blazers-jackets"
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-colors whitespace-nowrap"
          >
            بليزرات وجواكت
          </Link>
          <Link
            href="/products?category=women-collection"
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-colors whitespace-nowrap"
          >
            كولكشن حريمي
          </Link>
        </div>
      </div>
    </div>
  );
}
