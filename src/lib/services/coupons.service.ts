import { CouponItem } from "@/types";
import { getCouponRepository } from "@/lib/repositories/coupon.repository";
import { calculateDiscount } from "@/lib/domain/pricing";

/**
 * Service to fetch all available coupons.
 */
export async function getCoupons(): Promise<CouponItem[]> {
  return getCouponRepository().findMany();
}

/**
 * Service to fetch a single coupon by ID or coupon code.
 */
export async function getCouponById(identifier: string | number): Promise<CouponItem | null> {
  return getCouponRepository().findById(identifier);
}

/**
 * Service to create a new promotional coupon.
 */
export async function createCoupon(data: Omit<CouponItem, "id">): Promise<CouponItem> {
  return getCouponRepository().create(data);
}

/**
 * Service to update coupon properties.
 */
export async function updateCoupon(id: number, data: Partial<CouponItem>): Promise<CouponItem | null> {
  return getCouponRepository().update(id, data);
}

/**
 * Service to toggle active/inactive status of a coupon.
 */
export async function toggleCouponStatus(id: number, isActive: boolean): Promise<CouponItem | null> {
  return getCouponRepository().update(id, { isActive });
}

/**
 * Service to permanently remove a coupon.
 */
export async function deleteCoupon(id: number): Promise<boolean> {
  return getCouponRepository().delete(id);
}

/**
 * Domain Service to validate a coupon code and calculate applicable discounts.
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount: number; message: string; coupon?: CouponItem }> {
  const cleanCode = code.trim().toUpperCase();
  const c = await getCouponRepository().findById(cleanCode);

  if (!c) {
    return { valid: false, discount: 0, message: "كود الخصم غير موجود أو غير صالح" };
  }

  if (!c.isActive) {
    return { valid: false, discount: 0, message: "هذا الكوبون تم إيقافه حالياً" };
  }

  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) {
    return { valid: false, discount: 0, message: "عذراً، انتهت صلاحية هذا الكوبون" };
  }

  if (c.usageLimit && (c.usedCount ?? 0) >= c.usageLimit) {
    return { valid: false, discount: 0, message: "وصل الكوبون للحد الأقصى لعدد مرات الاستخدام" };
  }

  if (c.minOrderValue && subtotal < c.minOrderValue) {
    return {
      valid: false,
      discount: 0,
      message: `الحد الأدنى لتفعيل هذا الكوبون هو ${c.minOrderValue} ج.م (قيمة سلتك الحالية: ${subtotal} ج.م)`,
    };
  }

  const discount = calculateDiscount(subtotal, c.discountType, c.discountValue);

  return {
    valid: true,
    discount,
    message: `تم تطبيق خصم ${c.discountType === "percentage" ? `${c.discountValue}%` : `${c.discountValue} ج.م`} بنجاح!`,
    coupon: c,
  };
}
