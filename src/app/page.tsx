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
    alternates: {
      canonical: "/",
    },
  };
}

export const revalidate = 3600;

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
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: brandName,
    url: baseUrl,
    logo: `${baseUrl}/images/modanil-logo.svg`,
    image: `${baseUrl}/opengraph-image`,
    description:
      settings?.storeDescription ||
      `متجر الأزياء والملابس الكاجوال والأوفر سايز المصنوعة من أفخر خيوط قطن مصري فاخر في متجر ${brandName}.`,
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash, Credit Card, InstaPay, Vodafone Cash",
    sameAs: [
      settings?.facebookUrl || STORE_DEFAULTS.facebookUrl,
      settings?.instagramUrl || STORE_DEFAULTS.instagramUrl,
      settings?.tiktokUrl || STORE_DEFAULTS.tiktokUrl,
    ].filter(Boolean),
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: 128,
      bestRating: "5",
      worstRating: "1",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "هل يمكنني فتح الشحنة ومعاينة جودة النسيج والمقاس قبل الدفع؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: `نعم بكل تأكيد! نحن في ${brandName} نثق تماماً في جودة النسيج والتقفيل؛ لذلك يتيح لك مندوب الشحن فحص القطع والتأكد من الخامة والمقاس قبل دفع أي مبلغ، والدفع متاح نقداً أو عبر إنستاباي فور المعاينة.`,
        },
      },
      {
        "@type": "Question",
        name: "كم تستغرق مدة التوصيل لمحافظتي؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تصل الشحنات خلال 24 إلى 48 ساعة فقط لمحافظات القاهرة، الجيزة، والإسكندرية. وخلال 2 إلى 4 أيام عمل لكافة محافظات الدلتا، القناة، والصعيد عبر شركاء شحن معتمدين وسريعين.",
        },
      },
      {
        "@type": "Question",
        name: "ما هي طرق الدفع المدعومة عند إتمام الطلب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نوفر لك مرونة كاملة: الدفع نقداً عند الاستلام (COD)، تحويل لحظي عبر تطبيق إنستاباي (InstaPay)، محفظة فودافون كاش، وبطاقات الدفع البنكية وكروت ميزة الوطنية بأعلى معايير الأمان المشفر.",
        },
      },
      {
        "@type": "Question",
        name: "ما هي سياسة الاستبدال والاسترجاع؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نوفر لك مهلة 14 يوماً كاملة للاستبدال أو الاسترجاع في حال الرغبة في تبديل المقاس أو اللون أو الموديل. كل ما عليك هو التواصل مع فريق خدمة العملاء عبر الواتساب ويصلك مندوب الاستبدال حتى باب بيتك.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أعرف مقاسي المناسب في التيشيرتات الأوفر سايز والهوديز؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "جميع موديلاتنا مصممة بقصات Relaxed & Oversized مريحة وفقاً للمقاسات القياسية المصرية. يمكنك تصفح دليل المقاسات المرفق في صفحة كل منتج، أو استشارة فريقنا عبر الواتساب لتحديد المقاس المثالي لوزنك وطولك بدقة.",
        },
      },
    ],
  };

  return (
    <StoreShell
      settings={settings}
      categories={categories}
      mainClassName="flex-1 w-full max-w-full overflow-x-hidden"
    >
      {/* Search Engine & AI Structured Data (JSON-LD: Store, WebSite & FAQ) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
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
