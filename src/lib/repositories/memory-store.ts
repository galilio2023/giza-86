import { ProductItem, CategoryItem, OrderItem, CouponItem, StoreSettingsItem, NewsletterSubscriberItem } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_ORDERS } from "@/db/seed-data";

/**
 * In-memory fallback stores for demo preview mode when database is not configured.
 * Owned by the repository / persistence layer.
 */
export const memoryProducts: ProductItem[] = [...INITIAL_PRODUCTS];
export const memoryCategories: CategoryItem[] = [...INITIAL_CATEGORIES];
export const memoryOrders: OrderItem[] = [...INITIAL_ORDERS];
export const memoryCoupons: CouponItem[] = [...INITIAL_COUPONS];
export const memorySettings: StoreSettingsItem = { ...INITIAL_SETTINGS };
export const memoryNewsletter: NewsletterSubscriberItem[] = [];
