import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { HomeHero } from "@/components/store/HomeHero";
import { HomeCategories } from "@/components/store/HomeCategories";
import { HomePromoBanner } from "@/components/store/HomePromoBanner";
import { HomeProductsGrid } from "@/components/store/HomeProductsGrid";
import { HomeReviews } from "@/components/store/HomeReviews";
import { HomeFAQ } from "@/components/store/HomeFAQ";
import { getProducts, getCategories, getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  const title = settings?.seoTitle ? `${brandName} - ${settings.seoTitle}` : `${brandName} - متجر الأزياء والقطن المصري الفاخر`;
  const description = settings?.seoDescription || `تسوق تشكيلة الأزياء الكاجوال والأوفر سايز والهوديز المصنوعة من أفخر قطن مصري في متجر ${brandName}. شحن لكافة المحافظات ودفع عند الاستلام وإنستاباي.`;
  const keywords = settings?.seoKeywords ? settings.seoKeywords.split(",").map((k) => k.trim()) : [brandName, "قطن مصري", "ملابس كاجوال", "أوفر سايز", "هوديز", "إنستاباي", "فودافون كاش", "متجر مصري"];

  return {
    title,
    description,
    keywords,
  };
}

export default async function HomePage() {
  const [products, categories, settings, featuredProducts] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
    getStoreSettings(),
    getProducts({ featured: true, limit: 6 }).catch(() => []),
  ]);

  // Smart Hybrid: Prioritize products marked featured by admin, fallback to top catalog products
  const heroProducts = [
    ...featuredProducts,
    ...products.filter((p) => !featuredProducts.some((f) => f.id === p.id)),
  ].slice(0, 3);

  const brandName = settings?.storeName || STORE_DEFAULTS.storeName;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl;

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: brandName,
    url: baseUrl,
    description:
      settings?.storeDescription ||
      `متجر الأزياء والملابس الكاجوال والأوفر سايز المصنوعة من أفخر خيوط قطن مصري فاخر في متجر ${brandName}.`,
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash, Credit Card, InstaPay, Vodafone Cash",
    areaServed: {
      "@type": "Country",
      name: "Egypt",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.phone || STORE_DEFAULTS.phone,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
  };

  return (
    <StoreShell
      settings={settings}
      categories={categories}
      mainClassName="flex-1 w-full max-w-full overflow-x-hidden"
    >
      {/* Search Engine & AI Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeHero
        storeName={brandName}
        settings={settings}
        categories={categories}
        heroProducts={heroProducts}
      />
      <HomeCategories categories={categories} storeName={brandName} />
      <HomePromoBanner settings={settings} />
      <HomeProductsGrid products={products} />
      <HomeReviews storeName={brandName} />
      <HomeFAQ storeName={brandName} whatsapp={settings?.whatsapp} />
    </StoreShell>
  );
}
