import { OrderItem } from "@/types";
import { getOrderRepository, UpdateOrderStatusInput } from "@/lib/repositories/order.repository";
import { VALID_STATUS_TRANSITIONS, validateStatusTransition } from "@/lib/domain/orders";

export { VALID_STATUS_TRANSITIONS, validateStatusTransition };
export type { UpdateOrderStatusInput };

export async function updateOrderStatus(
  idOrOrderNumber: number | string,
  orderStatus?: OrderItem["orderStatus"],
  paymentStatus?: OrderItem["paymentStatus"],
  trackingNumber?: string
): Promise<OrderItem | null> {
  return getOrderRepository().updateStatus(idOrOrderNumber, { orderStatus, paymentStatus, trackingNumber });
}
