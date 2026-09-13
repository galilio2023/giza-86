import { CopyCouponButton } from "@/components/store/CopyCouponButton";
import { Sparkles } from "lucide-react";
import { StoreSettingsItem } from "@/types";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface HomePromoBannerProps {
  code?: string;
  settings?: Partial<StoreSettingsItem>;
}

export function HomePromoBanner({ code = STORE_DEFAULTS.promoCouponCode, settings }: HomePromoBannerProps) {
  // If explicitly turned off by store owner in admin settings, don't render
  if (settings?.isPromoBannerActive === false) {
    return null;
  }

  const promoBadge = settings?.promoBadge || STORE_DEFAULTS.promoBadge;
  const promoTitle = settings?.promoTitle || STORE_DEFAULTS.promoTitle;
  const promoDescription = settings?.promoDescription || STORE_DEFAULTS.promoDescription;
  const promoCode = settings?.promoCouponCode || code;

  return (
    <section className="layout-container mb-14 sm:mb-20 overflow-hidden">
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 text-white p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Ambient Warm Luxury Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full min-w-0">
          <div className="space-y-2 text-right w-full min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{promoBadge}</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {promoTitle}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm max-w-xl font-medium">
              {promoDescription}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3 bg-neutral-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-neutral-700/80 shadow-inner w-full sm:w-auto flex-shrink-0">
            <div className="px-4 py-1 text-center">
              <span className="text-xs text-neutral-400 block font-semibold">كود الخصم</span>
              <span className="text-lg font-black tracking-widest text-amber-400 font-mono">
                {promoCode}
              </span>
            </div>
            <CopyCouponButton code={promoCode} />
          </div>
        </div>
      </div>
    </section>
  );
}
