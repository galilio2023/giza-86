import { ProductItem, ProductVariantItem } from "@/types";

/**
 * Finds a matching variant from a collection based on size and color name.
 * Normalizes case and trims whitespace to prevent mismatched lookups.
 */
export function findMatchingVariant<T extends { size: string; colorName: string }>(
  variants: T[] | undefined | null,
  size: string,
  colorName: string
): T | undefined {
  if (!variants || variants.length === 0) return undefined;
  const targetSize = size.trim().toUpperCase();
  const targetColor = colorName.trim().toLowerCase();

  return variants.find(
    (v) =>
      v.size.trim().toUpperCase() === targetSize &&
      v.colorName.trim().toLowerCase() === targetColor
  );
}

/**
 * Resolves the effective purchasing price for a product and its selected variant.
 * If the variant has an explicit price, that price is used; otherwise product salePrice/price is used.
 */
export function getEffectivePrice(
  product: Pick<ProductItem, "price" | "salePrice">,
  variant?: Pick<ProductVariantItem, "price"> | null
): number {
  if (variant && variant.price !== undefined && variant.price !== null && !isNaN(Number(variant.price))) {
    return Number(variant.price);
  }
  if (product.salePrice !== undefined && product.salePrice !== null && Number(product.salePrice) > 0) {
    return Number(product.salePrice);
  }
  return Number(product.price);
}

/**
 * Returns the effective available stock for a product or specific variant.
 */
export function getEffectiveStock(
  product: Pick<ProductItem, "stock">,
  variant?: Pick<ProductVariantItem, "stock"> | null
): number {
  if (variant && variant.stock !== undefined && variant.stock !== null) {
    return Math.max(0, variant.stock);
  }
  return Math.max(0, product.stock || 0);
}
