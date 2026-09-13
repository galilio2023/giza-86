import { StoreSettingsItem } from "@/types";
import { NavbarSearch } from "@/components/store/NavbarSearch";
import { NavbarActions } from "@/components/store/NavbarActions";
import { NavbarMobileMenu } from "@/components/store/NavbarMobileMenu";
import { NavbarLinks } from "@/components/store/NavbarLinks";

import { BrandLogo } from "@/components/store/BrandLogo";
import { CategoryItem } from "@/types";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface NavbarProps {
  settings?: Partial<StoreSettingsItem>;
  categories?: CategoryItem[];
}

export function Navbar({ settings, categories }: NavbarProps = {}) {
  const isBannerActive =
    settings?.isBannerActive !== undefined
      ? settings.isBannerActive
      : STORE_DEFAULTS.isBannerActive;
  const customNotice = settings?.bannerNotice?.trim();
  const bannerNotice = customNotice || STORE_DEFAULTS.bannerNotice;
  const showBanner = Boolean(isBannerActive && bannerNotice);

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "جميع الموديلات", href: "/products" },
    ...(categories && categories.length > 0
      ? categories.slice(0, 5).map((c) => ({
          label: c.name,
          href: `/products?category=${c.slug}`,
        }))
      : [
          { label: "أوفر سايز", href: "/products?category=oversized-tshirts" },
          { label: "هوديز", href: "/products?category=hoodies-sweatshirts" },
          { label: "قمصان", href: "/products?category=casual-shirts" },
          { label: "نسائي", href: "/products?category=women-collection" },
        ]),
    { label: "العروض 🔥", href: "/products?onSale=true", highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Announcement Strip (Controlled via Dashboard) */}
      {showBanner && (
        <div className="bg-neutral-950 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-bold tracking-wide border-b border-neutral-800/80">
          <div className="layout-container flex items-center justify-center gap-2">
            <span>{bannerNotice}</span>
          </div>
        </div>
      )}

      {/* Main Streamlined Navbar - Single Unified Sleek Row */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs relative">
        <div className="layout-container">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4 xl:gap-6">
            {/* Right (Start in RTL): Mobile Menu (Mobile only) + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-max">
              <NavbarMobileMenu navLinks={navLinks} />

              <BrandLogo name={settings?.storeName} logoUrl={settings?.logoUrl} showSubtext={false} />
            </div>

            {/* Center: Desktop Navigation Links (Unified, elegant, non-overlapping) */}
            <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2 xl:px-4">
              <NavbarLinks categories={categories} />
            </div>

            {/* Left (End in RTL): Search Bar (Desktop) & Actions (Wishlist + Cart) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-max">
              <div className="hidden lg:block">
                <NavbarSearch />
              </div>
              <NavbarActions />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
