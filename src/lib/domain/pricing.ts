import { EGYPTIAN_GOVERNORATES } from "@/lib/egypt-constants";

/**
 * Pure function to calculate coupon discount amount based on discount type and subtotal.
 */
export function calculateDiscount(
  subtotal: number,
  discountType: "percentage" | "fixed",
  discountValue: number
): number {
  if (subtotal <= 0 || discountValue <= 0) return 0;

  if (discountType === "percentage") {
    const percent = Math.min(100, Math.max(0, Number(discountValue)));
    return Math.round((subtotal * percent) / 100);
  }

  return Math.min(subtotal, Math.round(Number(discountValue)));
}

/**
 * Pure function to calculate the discount percentage between regular price and sale price.
 */
export function getDiscountPercentage(price: number, salePrice?: number | null): number {
  if (!salePrice || salePrice >= price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/**
 * Pure function to calculate shipping fee with canonical Egyptian governorate lookup
 * and free shipping threshold checks.
 */
export function calculateShippingFee(
  subtotal: number,
  governorate: string,
  freeShippingThreshold: number,
  customRates?: Record<string, number> | null
): number {
  if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) {
    return 0;
  }

  const govObj = EGYPTIAN_GOVERNORATES.find(
    (g) => g.name === governorate || g.id === governorate.toLowerCase()
  );
  const canonicalGovernorate = govObj ? govObj.name : governorate;

  if (customRates) {
    if (customRates[canonicalGovernorate] !== undefined) {
      return customRates[canonicalGovernorate];
    }
    if (customRates[governorate] !== undefined) {
      return customRates[governorate];
    }
  }

  return govObj ? govObj.rate : 65;
}

/**
 * Calculate final order total ensuring it never drops below zero.
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingFee: number,
  discount: number
): number {
  return Math.max(0, subtotal + shippingFee - discount);
}
