import { OrderItem } from "@/types";
import { InvalidStatusTransitionError } from "./errors";

/**
 * Valid order status transition state machine.
 * Pure business rules that govern the lifecycle of an order.
 */
export const VALID_STATUS_TRANSITIONS: Record<OrderItem["orderStatus"], OrderItem["orderStatus"][]> = {
  new: ["confirmed", "processing", "cancelled"],
  confirmed: ["processing", "shipped", "cancelled"],
  processing: ["shipped", "delivered", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: ["new", "confirmed"],
  returned: [],
};

/**
 * Validates whether transitioning an order from currentStatus to newStatus is allowed.
 * Throws InvalidStatusTransitionError if the transition is illegal.
 */
export function validateStatusTransition(
  currentStatus: OrderItem["orderStatus"],
  newStatus: OrderItem["orderStatus"]
): void {
  if (currentStatus === newStatus) return;
  const allowed = VALID_STATUS_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new InvalidStatusTransitionError(
      `لا يمكن تغيير حالة الطلب من "${currentStatus}" إلى "${newStatus}". الحالات المسموح بها: ${allowed?.join(", ") || "لا يوجد"}`
    );
  }
}
