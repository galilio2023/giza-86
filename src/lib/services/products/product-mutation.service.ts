import { ProductItem } from "@/types";
import { getProductRepository } from "@/lib/repositories/product.repository";

/**
 * Service to create a new product and its initial size/color variants.
 */
export async function createProduct(
  data: Omit<ProductItem, "id" | "createdAt" | "updatedAt">
): Promise<ProductItem> {
  return getProductRepository().create(data);
}

/**
 * Service to update product attributes and synchronize its variants.
 */
export async function updateProduct(
  id: number,
  data: Partial<ProductItem>
): Promise<ProductItem | null> {
  return getProductRepository().update(id, data);
}

/**
 * Service to delete a product and its associated variants.
 */
export async function deleteProduct(id: number): Promise<boolean> {
  return getProductRepository().delete(id);
}
