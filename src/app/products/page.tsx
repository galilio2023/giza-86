import { Suspense } from "react";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductsCatalogClient } from "@/components/store/ProductsCatalogClient";
import { getProductsWithCount, getCategories, getStoreSettings } from "@/lib/data-service";

import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  return {
    title: `جميع الموديلات والملابس | ${brandName}`,
    description: `تصفح أحدث كولكشن من التيشيرتات الأوفر سايز، الهوديز، والقمصان الكاجوال من قطن مصري فاخر 100% في متجر ${brandName}.`,
  };
}

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

  return (
    <StoreShell
      settings={settings}
      categories={categories}
      mainClassName="flex-1 layout-container py-8 sm:py-12 w-full max-w-full"
    >
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
