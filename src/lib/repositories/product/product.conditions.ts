import { products, categories } from "@/db/schema";
import { eq, and, ilike, or, sql, isNotNull, lt, gt, gte, lte, inArray, aliasedTable } from "drizzle-orm";
import { sanitizeSearchQuery } from "@/lib/utils";
import { GetProductsOptions } from "./product.interface";

export const parentCategories = aliasedTable(categories, "parent_categories");

/** Builds database predicates for the supplied product catalog and stock filters. */
export function buildProductConditions(options?: GetProductsOptions) {
  const conditions = [];

  if (options?.categoryId !== undefined) {
    conditions.push(
      or(
        eq(products.categoryId, options.categoryId),
        eq(categories.parentId, options.categoryId)
      )
    );
  } else if (options?.categorySlug) {
    const rawCat = options.categorySlug.trim();
    let decodedCat = rawCat;
    try {
      decodedCat = decodeURIComponent(rawCat);
    } catch {
      // ignore
    }
    const catCandidates = Array.from(new Set([rawCat, decodedCat])).filter(Boolean);
    if (catCandidates.length > 1) {
      conditions.push(
        or(
          inArray(categories.slug, catCandidates),
          inArray(parentCategories.slug, catCandidates)
        )
      );
    } else {
      const targetSlug = catCandidates[0] || rawCat;
      conditions.push(
        or(
          eq(categories.slug, targetSlug),
          eq(parentCategories.slug, targetSlug)
        )
      );
    }
  }

  if (options?.featured) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (options?.onSale) {
    conditions.push(and(isNotNull(products.salePrice), lt(products.salePrice, products.price)));
  }

  if (options?.stockStatus === "out_of_stock") {
    conditions.push(lte(products.stock, 0));
  } else if (options?.stockStatus === "low_stock") {
    conditions.push(and(gt(products.stock, 0), lte(products.stock, 5)));
  } else if (options?.stockStatus === "in_stock" || options?.inStock) {
    conditions.push(gt(products.stock, 0));
  }

  if (options?.size && options.size !== "all") {
    conditions.push(sql`${products.sizes} @> ${JSON.stringify([options.size])}::jsonb`);
  }

  if (options?.minPrice !== undefined) {
    conditions.push(gte(sql`COALESCE(${products.salePrice}, ${products.price})`, String(options.minPrice)));
  }

  if (options?.maxPrice !== undefined) {
    conditions.push(lte(sql`COALESCE(${products.salePrice}, ${products.price})`, String(options.maxPrice)));
  }

  if (options?.search?.trim()) {
    const safeQuery = `%${sanitizeSearchQuery(options.search.trim())}%`;
    conditions.push(
      or(
        ilike(products.name, safeQuery),
        ilike(products.description, safeQuery),
        ilike(products.sku, safeQuery)
      )
    );
  }

  return conditions;
}
