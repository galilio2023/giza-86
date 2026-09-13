import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CategoryItem } from "@/types";
import { getCategoryRepository } from "@/lib/repositories/category.repository";

/**
 * Service to retrieve all store categories.
 * Cached globally across requests via Next.js Data Cache (unstable_cache with tag 'categories')
 * and memoized per request using React cache().
 */
const getCachedCategories = unstable_cache(
  async () => getCategoryRepository().findMany(),
  ["store-categories-list"],
  {
    revalidate: 3600,
    tags: ["categories"],
  }
);

export const getCategories = cache(async function getCategories(): Promise<CategoryItem[]> {
  return getCachedCategories();
});

/**
 * Service to retrieve a single category by its numerical ID or URL slug.
 */
export async function getCategoryById(identifier: string | number): Promise<CategoryItem | null> {
  return getCategoryRepository().findById(identifier);
}

/**
 * Service to create a new category in the catalog.
 */
export async function createCategory(data: Omit<CategoryItem, "id">): Promise<CategoryItem> {
  return getCategoryRepository().create(data);
}

/**
 * Service to update an existing category.
 */
export async function updateCategory(id: number, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
  return getCategoryRepository().update(id, data);
}

/**
 * Service to delete a category and re-assign orphaned products.
 */
export async function deleteCategory(id: number): Promise<boolean> {
  return getCategoryRepository().delete(id);
}
