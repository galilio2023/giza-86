import { OrderItem } from "@/types";
import {
  getOrderRepository,
  GetOrdersOptions,
  OrdersPageResult,
  buildOrderConditions,
  TrackOrderResult,
} from "@/lib/repositories/order.repository";

export type { GetOrdersOptions, OrdersPageResult, TrackOrderResult };
export { buildOrderConditions };

/**
 * Service to fetch filtered orders with pagination.
 */
export async function getOrders(options?: GetOrdersOptions): Promise<OrderItem[]> {
  return getOrderRepository().findMany(options);
}

/**
 * Service to fetch paginated orders with total count for admin data tables.
 */
export async function getOrdersWithCount(options?: GetOrdersOptions): Promise<OrdersPageResult> {
  return getOrderRepository().findWithCount(options);
}

/**
 * Service to retrieve distribution counts of orders by status.
 */
export async function getOrderStatusCounts(): Promise<Record<string, number>> {
  return getOrderRepository().getStatusCounts();
}

/**
 * Customer-facing service to track order status by order number and phone number.
 */
export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<TrackOrderResult | null> {
  return getOrderRepository().track(orderNumber, phone);
}

/**
 * Service to retrieve a single order by orderNumber or database numerical ID.
 */
export async function getOrderById(
  orderNumberOrId: string | number,
  allowNumericId = false
): Promise<OrderItem | null> {
  return getOrderRepository().findById(orderNumberOrId, allowNumericId);
}
