import { Suspense } from "react";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductsCatalogClient } from "@/components/store/ProductsCatalogClient";
import { getProductsWithCount, getCategories, getStoreSettings } from "@/lib/data-service";

import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    onSale?: string;
    featured?: string;
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const [sp, settings, categories] = await Promise.all([
    searchParams,
    getStoreSettings().catch(() => null),
    getCategories().catch(() => []),
  ]);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  const currentCategory = sp?.category && sp.category !== "all"
    ? categories.find((c) => c.slug === sp.category || String(c.id) === sp.category)
    : null;

  const isSale = sp?.onSale === "true";
  const searchQuery = sp?.q?.trim();

  let title = `جميع الموديلات والملابس | ${brandName}`;
  let description = `تصفح أحدث كولكشن من التيشيرتات الأوفر سايز، الهوديز، والقمصان الكاجوال من قطن مصري فاخر 100% في متجر ${brandName}. شحن لكافة المحافظات ودفع عند الاستلام وإنستاباي.`;
  let canonicalPath = "/products";

  if (currentCategory) {
    title = `${currentCategory.name} - أزياء وقطن مصري فاخر | ${brandName}`;
    description = currentCategory.description || `تسوق تشكيلة ${currentCategory.name} المصنوعة من أفخر قطن مصري بأعلى مواصفات النسيج والتقفيل في متجر ${brandName}. شحن سريع ومعاينة قبل الاستلام.`;
    canonicalPath = `/products?category=${encodeURIComponent(currentCategory.slug)}`;
  } else if (isSale) {
    title = `عروض وتخفيضات الأزياء | ${brandName}`;
    description = `استفد من أقوى عروض وتخفيضات الملابس والقطن المصري في متجر ${brandName}. خصومات حصرية وتوصيل لكافة المحافظات.`;
    canonicalPath = "/products?onSale=true";
  } else if (searchQuery) {
    title = `نتائج البحث عن "${searchQuery}" | ${brandName}`;
    description = `استكشف نتائج البحث عن ${searchQuery} في متجر ${brandName} للأزياء والملابس القطنية.`;
    canonicalPath = `/products?q=${encodeURIComponent(searchQuery)}`;
  }

  const page = Number(sp?.page) > 1 ? Number(sp.page) : 1;
  if (page > 1) {
    const separator = canonicalPath.includes("?") ? "&" : "?";
    canonicalPath = `${canonicalPath}${separator}page=${page}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
      locale: "ar_EG",
      siteName: brandName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const page = Number(sp?.page) > 0 ? Number(sp.page) : 1;
  const limit = 24;
  const offset = (page - 1) * limit;
  const sortBy =
    sp?.sort === "price-asc" || sp?.sort === "price-desc" || sp?.sort === "oldest"
      ? sp.sort
      : "newest";

  const [productsResult, categories, settings] = await Promise.all([
    getProductsWithCount({
      categorySlug: sp?.category && sp.category !== "all" ? sp.category : undefined,
      onSale: sp?.onSale === "true",
      featured: sp?.featured === "true",
      inStock: sp?.inStock === "true",
      size: sp?.size && sp.size !== "all" ? sp.size : undefined,
      minPrice: sp?.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp?.maxPrice ? Number(sp.maxPrice) : undefined,
      search: sp?.q?.trim() || undefined,
      sortBy,
      limit,
      offset,
    }),
    getCategories(),
    getStoreSettings(),
  ]);

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");
  const currentCategory = sp?.category && sp.category !== "all"
    ? categories.find((c) => c.slug === sp.category || String(c.id) === sp.category)
    : null;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: currentCategory ? currentCategory.name : "تشكيلة أزياء وملابس قطن مصري",
    itemListElement: productsResult.products.map((p, idx) => ({
      "@type": "ListItem",
      position: offset + idx + 1,
      name: p.name,
      url: `${baseUrl}/products/${encodeURIComponent(p.slug || String(p.id))}`,
      image: p.images && p.images.length > 0 ? p.images[0] : undefined,
    })),
  };

  return (
    <StoreShell
      settings={settings}
      categories={categories}
      mainClassName="flex-1 layout-container py-8 sm:py-12 w-full max-w-full"
    >
      {/* Search Engine & AI Structured Data (JSON-LD: ItemList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense
        fallback={
          <div className="py-20 text-center font-bold text-neutral-500">
            جاري تحميل الموديلات...
          </div>
        }
      >
        <ProductsCatalogClient
          initialProducts={productsResult.products}
          totalCount={productsResult.total}
          currentPage={page}
          pageSize={limit}
          categories={categories}
        />
      </Suspense>
    </StoreShell>
  );
}
