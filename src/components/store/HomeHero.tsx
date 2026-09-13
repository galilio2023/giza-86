import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowLeft, Truck, Banknote, ShieldCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { HeroLookbook } from "@/components/store/HeroLookbook";
import { StoreSettingsItem } from "@/types";

interface HomeHeroProps {
  storeName?: string;
  settings?: Partial<StoreSettingsItem>;
}

export function HomeHero({ storeName, settings }: HomeHeroProps = {}) {
  const currentBrand = settings?.storeName || storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  const heroBadge = settings?.heroBadge || STORE_DEFAULTS.heroBadge;
  const heroTitle = settings?.heroTitle || STORE_DEFAULTS.heroTitle;
  const heroSubtitle = settings?.heroSubtitle || STORE_DEFAULTS.heroSubtitle;
  const heroBgImage = settings?.heroBgImage || STORE_DEFAULTS.heroBgImage;
  const heroPrimaryBtnText = settings?.heroPrimaryBtnText || STORE_DEFAULTS.heroPrimaryBtnText;
  const heroPrimaryBtnLink = settings?.heroPrimaryBtnLink || STORE_DEFAULTS.heroPrimaryBtnLink;

  return (
    <section className="relative border-b border-border overflow-hidden bg-white">
      {/* Background Studio Visual Image - Clear & Crisp */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBgImage}
          alt={`${currentBrand} Studio`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top sm:object-center opacity-90 md:opacity-95 filter saturate-[0.95]"
        />
        {/* Subtle bottom gradient to keep transition smooth */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
      </div>

      <div className="layout-container py-6 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Text content (Left side in RTL) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-right p-4 sm:p-8 lg:p-10 rounded-3xl bg-white/40 sm:bg-white/80 backdrop-blur-xs sm:backdrop-blur-md border border-white/60 sm:border-neutral-200/80 shadow-none sm:shadow-sm">
            <div className="inline-flex items-center gap-1.5 bg-white/90 text-neutral-950 border border-neutral-200 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="truncate">{heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 leading-[1.18]">
              {heroTitle}
              <br />
              <span className="text-gradient-gold font-black">{currentBrand}</span>
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-neutral-800 max-w-xl leading-relaxed font-semibold">
              {heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-2.5 pt-1 w-full sm:w-auto">
              <Link href={heroPrimaryBtnLink} className="flex-1 sm:flex-initial">
                <Button variant="amber" size="lg" className="w-full sm:w-auto px-5 sm:px-8 text-xs sm:text-sm font-black shadow-md min-h-[42px]">
                  <span>{heroPrimaryBtnText}</span>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </Link>

              <Link href="/products?onSale=true" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-4 sm:px-6 text-xs sm:text-sm font-bold bg-white/90 hover:bg-white shadow-2xs border-neutral-200 min-h-[42px]">
                  <Flame className="w-4 h-4 text-rose-500 ml-1 flex-shrink-0" />
                  <span>التخفيضات</span>
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-4 sm:pt-6 border-t border-neutral-200/60 grid grid-cols-3 gap-2 sm:gap-3 text-sm text-neutral-800 font-bold">
              <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 sm:p-2.5 rounded-xl bg-white/60 sm:bg-neutral-50/80 border border-neutral-200/50 text-center sm:text-right">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center flex-shrink-0 shadow-2xs border border-neutral-200">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">شحن لمصر</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 sm:p-2.5 rounded-xl bg-white/60 sm:bg-neutral-50/80 border border-neutral-200/50 text-center sm:text-right">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center flex-shrink-0 shadow-2xs border border-neutral-200">
                  <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">كاش/إنستاباي</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 sm:p-2.5 rounded-xl bg-white/60 sm:bg-neutral-50/80 border border-neutral-200/50 text-center sm:text-right">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center flex-shrink-0 shadow-2xs border border-neutral-200">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">معاينة أولاً</span>
              </div>
            </div>
          </div>

          {/* Curated Category Lookbook Showcase (Right side in RTL) */}
          <HeroLookbook />
        </div>
      </div>
    </section>
  );
}
