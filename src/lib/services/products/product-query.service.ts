import { cache } from "react";
import { unstable_cache } from "next/cache";
import { ProductItem } from "@/types";
import {
  getProductRepository,
  GetProductsOptions,
  ProductsPageResult,
  buildProductConditions,
} from "@/lib/repositories/product.repository";

export type { GetProductsOptions, ProductsPageResult };
export { buildProductConditions };

/**
 * Next.js Data Cache wrapper for catalog queries.
 * Tagged with 'products' to invalidate synchronously when products are updated or created.
 */
const getCachedCatalogProducts = unstable_cache(
  async (optionsJson: string) => {
    const options: GetProductsOptions | undefined = optionsJson ? JSON.parse(optionsJson) : undefined;
    return getProductRepository().findMany(options);
  },
  ["store-products-list"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

const getCachedProductsWithCount = unstable_cache(
  async (optionsJson: string) => {
    const options: GetProductsOptions | undefined = optionsJson ? JSON.parse(optionsJson) : undefined;
    return getProductRepository().findWithCount(options);
  },
  ["store-products-with-count"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

const getCachedProductById = unstable_cache(
  async (idOrSlug: string) => {
    let decoded = idOrSlug;
    try {
      decoded = decodeURIComponent(idOrSlug);
    } catch {
      // ignore
    }
    return getProductRepository().findById(decoded);
  },
  ["store-product-detail"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

const getCachedRelatedProducts = unstable_cache(
  async (categoryId: number, currentProductId: number, limit: number) =>
    getProductRepository().getRelated(categoryId, currentProductId, limit),
  ["store-related-products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

const getCachedFeaturedProducts = unstable_cache(
  async (limit: number) => getProductRepository().findMany({ featured: true, limit }),
  ["store-featured-products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

const getCachedNewArrivals = unstable_cache(
  async (limit: number) => getProductRepository().findMany({ sortBy: "newest", limit }),
  ["store-new-arrivals"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

/**
 * Service to fetch filtered & paginated products.
 * Uses cached results for standard browsing, bypasses cache for real-time text search.
 */
export async function getProducts(options?: GetProductsOptions): Promise<ProductItem[]> {
  if (options?.search?.trim()) {
    return getProductRepository().findMany(options);
  }
  return getCachedCatalogProducts(JSON.stringify(options ?? {}));
}

/**
 * Service to fetch paginated products along with exact matching record count for storefront.
 */
export async function getProductsWithCount(options?: GetProductsOptions): Promise<ProductsPageResult> {
  if (options?.search?.trim()) {
    return getProductRepository().findWithCount(options);
  }
  return getCachedProductsWithCount(JSON.stringify(options ?? {}));
}

/**
 * Service for administrative inventory listings.
 * Bypasses the storefront catalog data cache completely to guarantee real-time stock and pricing accuracy.
 */
export async function getAdminProductsWithCount(options?: GetProductsOptions): Promise<ProductsPageResult> {
  return getProductRepository().findWithCount(options);
}

/**
 * Service to retrieve a single product by numeric ID or URL slug.
 * Cached globally across requests and memoized per request using React cache().
 */
export const getProductById = cache(async function getProductById(
  idOrSlug: string | number
): Promise<ProductItem | null> {
  const raw = String(idOrSlug).trim();
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // ignore
  }
  return getCachedProductById(decoded);
});

export const getProductBySlugOrId = getProductById;

/**
 * Service to retrieve related products in the same category.
 */
export async function getRelatedProducts(
  categoryId: number,
  currentProductId: number,
  limit = 4
): Promise<ProductItem[]> {
  return getCachedRelatedProducts(categoryId, currentProductId, limit);
}

/**
 * Service to retrieve products whose base inventory has fallen below threshold.
 * Kept real-time for live admin inventory replenishment warnings.
 */
export async function getLowStockProducts(threshold = 5, limit = 10): Promise<ProductItem[]> {
  return getProductRepository().getLowStock(threshold, limit);
}

/**
 * Service to retrieve featured products for showcase grids.
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductItem[]> {
  return getCachedFeaturedProducts(limit);
}

/**
 * Service to retrieve newest arrival products.
 */
export async function getNewArrivals(limit = 8): Promise<ProductItem[]> {
  return getCachedNewArrivals(limit);
}
