import { eq, ilike, or } from "drizzle-orm";
import { orders } from "@/db/schema";
import { normalizeEgyptianPhone } from "@/lib/egypt-constants";
import { sanitizeSearchQuery } from "@/lib/utils";
import { GetOrdersOptions } from "./order.interface";

/** Builds database SQL query predicates for filtering orders by status, payment, governorate, and customer search. */
export function buildOrderConditions(options?: GetOrdersOptions) {
  const conditions = [];

  if (options?.status && options.status !== "all") {
    conditions.push(eq(orders.orderStatus, options.status));
  }

  if (options?.paymentStatus && options.paymentStatus !== "all") {
    conditions.push(eq(orders.paymentStatus, options.paymentStatus));
  }

  if (options?.paymentMethod && options.paymentMethod !== "all") {
    conditions.push(eq(orders.paymentMethod, options.paymentMethod));
  }

  if (options?.governorate && options.governorate !== "all") {
    conditions.push(eq(orders.governorate, options.governorate));
  }

  if (options?.search?.trim()) {
    const cleanSearch = options.search.trim();
    const safeQuery = `%${sanitizeSearchQuery(cleanSearch)}%`;
    const normPhone = normalizeEgyptianPhone(cleanSearch);

    const searchOrs = [
      ilike(orders.orderNumber, safeQuery),
      ilike(orders.customerName, safeQuery),
      ilike(orders.customerPhone, safeQuery),
      ilike(orders.alternatePhone, safeQuery),
      ilike(orders.trackingNumber, safeQuery),
      ilike(orders.city, safeQuery),
      ilike(orders.governorate, safeQuery),
    ];

    if (normPhone && normPhone.length >= 7) {
      searchOrs.push(
        ilike(orders.customerPhone, `%${normPhone}%`),
        ilike(orders.alternatePhone, `%${normPhone}%`)
      );
    }

    conditions.push(or(...searchOrs));
  }

  return conditions;
}
