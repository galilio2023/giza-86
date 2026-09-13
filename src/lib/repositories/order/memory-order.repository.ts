import { OrderItem } from "@/types";
import { normalizeEgyptianPhone } from "@/lib/egypt-constants";
import {
  memoryOrders,
  memoryProducts,
  memoryCoupons,
  memorySettings,
} from "../memory-store";
import { calculateDiscount, calculateShippingFee, calculateOrderTotal } from "@/lib/domain/pricing";
import { findMatchingVariant } from "@/lib/domain/variants";
import { OutOfStockError, StoreClosedError, CouponError, NotFoundError } from "@/lib/domain/errors";
import { validateStatusTransition } from "@/lib/domain/orders";
import {
  IOrderRepository,
  GetOrdersOptions,
  OrdersPageResult,
  TrackOrderResult,
  CreateOrderInput,
  PersistOrderInput,
  UpdateOrderStatusInput,
} from "./order.interface";

export class MemoryOrderRepository implements IOrderRepository {
  async findMany(options?: GetOrdersOptions): Promise<OrderItem[]> {
    let list = [...memoryOrders];
    if (options?.status && options.status !== "all") {
      list = list.filter((o) => o.orderStatus === options.status);
    }
    if (options?.paymentStatus && options.paymentStatus !== "all") {
      list = list.filter((o) => o.paymentStatus === options.paymentStatus);
    }
    if (options?.paymentMethod && options.paymentMethod !== "all") {
      list = list.filter((o) => o.paymentMethod === options.paymentMethod);
    }
    if (options?.governorate && options.governorate !== "all") {
      list = list.filter((o) => o.governorate === options.governorate);
    }
    if (options?.search?.trim()) {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.alternatePhone && o.alternatePhone.includes(q)) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
          o.city.toLowerCase().includes(q) ||
          o.governorate.toLowerCase().includes(q)
      );
    }
    if (options?.offset && options.offset > 0) {
      list = list.slice(options.offset);
    }
    if (options?.limit && options.limit > 0) {
      list = list.slice(0, Math.min(200, options.limit));
    }
    return list;
  }

  async findWithCount(options?: GetOrdersOptions): Promise<OrdersPageResult> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    const allMatching = await this.findMany({ ...options, limit: undefined, offset: undefined });
    const paginated = allMatching.slice(offset, offset + limit);
    return {
      orders: paginated,
      total: allMatching.length,
      limit,
      offset,
    };
  }

  async findById(orderNumberOrId: string | number, allowNumericId = false): Promise<OrderItem | null> {
    const idStr = String(orderNumberOrId).trim();
    const idStrUpper = idStr.toUpperCase();
    const idNum = Number(idStr);
    if (allowNumericId && !isNaN(idNum)) {
      return memoryOrders.find((o) => o.id === idNum || o.orderNumber.toUpperCase() === idStrUpper) || null;
    }
    return memoryOrders.find((o) => o.orderNumber.toUpperCase() === idStrUpper) || null;
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = { all: memoryOrders.length };
    for (const o of memoryOrders) {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    }
    return counts;
  }

  async track(orderNumber: string, phone: string): Promise<TrackOrderResult | null> {
    const cleanOrderNum = orderNumber.trim();
    const normalizedPhone = normalizeEgyptianPhone(phone);
    if (!cleanOrderNum || !normalizedPhone) return null;

    const cleanUpper = cleanOrderNum.toUpperCase();
    const phoneSuffix = normalizedPhone.slice(-10);

    const found = memoryOrders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanUpper &&
        (normalizeEgyptianPhone(o.customerPhone) === normalizedPhone ||
          (o.alternatePhone && normalizeEgyptianPhone(o.alternatePhone) === normalizedPhone) ||
          o.customerPhone.includes(phoneSuffix) ||
          (o.alternatePhone && o.alternatePhone.includes(phoneSuffix)))
    );
    if (!found) return null;

    return {
      orderNumber: found.orderNumber,
      orderStatus: found.orderStatus,
      paymentStatus: found.paymentStatus,
      paymentMethod: found.paymentMethod,
      customerName: found.customerName,
      governorate: found.governorate,
      city: found.city,
      address: found.address,
      trackingNumber: found.trackingNumber,
      items: found.items,
      subtotal: found.subtotal,
      shippingFee: found.shippingFee,
      discount: found.discount,
      total: found.total,
      createdAt: found.createdAt,
    };
  }

  async create(data: PersistOrderInput): Promise<OrderItem> {
    if (process.env.NODE_ENV === "production" && !process.env.ALLOW_EPHEMERAL_ORDERS) {
      console.warn(
        "[DURABILITY WARNING]: An order is being processed via MemoryOrderRepository in production. Verify DATABASE_URL is configured for persistent PostgreSQL storage."
      );
    }

    if (data.couponCode?.trim()) {
      const cleanCode = data.couponCode.trim().toUpperCase();
      const coup = memoryCoupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
      if (coup) {
        coup.usedCount = (coup.usedCount || 0) + 1;
      }
    }

    for (const vd of data.variantDeductions) {
      for (const mp of memoryProducts) {
        if (mp.variants) {
          const v = mp.variants.find((pv) => pv.id === vd.variantId);
          if (v) {
            v.stock = Math.max(0, v.stock - vd.quantity);
          }
        }
      }
    }

    for (const pd of data.productDeductions) {
      const p = memoryProducts.find((mp) => mp.id === pd.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - pd.quantity);
      }
    }

    const newOrder: OrderItem = {
      id: Date.now(),
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerPhone: normalizeEgyptianPhone(data.customerPhone),
      alternatePhone:
        data.alternatePhone && data.alternatePhone.trim()
          ? normalizeEgyptianPhone(data.alternatePhone)
          : undefined,
      governorate: data.governorate,
      city: data.city,
      address: data.address,
      notes: data.notes || undefined,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || "pending",
      orderStatus: data.orderStatus || "new",
      items: data.items,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      discount: data.discount,
      couponCode: data.couponCode || undefined,
      total: data.total,
      createdAt: new Date().toISOString(),
    };

    memoryOrders.unshift(newOrder);
    return newOrder;
  }

  async updateStatus(
    idOrOrderNumber: number | string,
    input: UpdateOrderStatusInput
  ): Promise<OrderItem | null> {
    const { orderStatus, paymentStatus, trackingNumber } = input;
    const numId = typeof idOrOrderNumber === "number" ? idOrOrderNumber : Number(idOrOrderNumber);
    const orderIdx = memoryOrders.findIndex((o) =>
      !isNaN(numId)
        ? o.id === numId || o.orderNumber === String(idOrOrderNumber)
        : o.orderNumber === String(idOrOrderNumber)
    );
    if (orderIdx === -1) return null;
    const prev = memoryOrders[orderIdx];
    const targetStatus = orderStatus || prev.orderStatus;

    if (orderStatus && orderStatus !== prev.orderStatus) {
      validateStatusTransition(prev.orderStatus, orderStatus);
    }

    const wasCancelledOrReturned =
      prev.orderStatus === "cancelled" || prev.orderStatus === "returned";
    const isNowCancelledOrReturned = targetStatus === "cancelled" || targetStatus === "returned";

    if (!wasCancelledOrReturned && isNowCancelledOrReturned) {
      for (const item of prev.items) {
        const p = memoryProducts.find((mp) => mp.id === item.productId);
        if (p) {
          p.stock += item.quantity;
          if (item.variantId && p.variants) {
            const v = p.variants.find((pv) => pv.id === item.variantId);
            if (v) v.stock += item.quantity;
          }
          p.updatedAt = new Date().toISOString();
        }
      }
      if (prev.couponCode) {
        const coup = memoryCoupons.find((c) => c.code === prev.couponCode);
        if (coup && (coup.usedCount ?? 0) > 0) {
          coup.usedCount = (coup.usedCount ?? 0) - 1;
          coup.updatedAt = new Date().toISOString();
        }
      }
    } else if (wasCancelledOrReturned && !isNowCancelledOrReturned) {
      for (const item of prev.items) {
        const p = memoryProducts.find((mp) => mp.id === item.productId);
        if (p) {
          p.stock = Math.max(0, p.stock - item.quantity);
          if (item.variantId && p.variants) {
            const v = p.variants.find((pv) => pv.id === item.variantId);
            if (v) v.stock = Math.max(0, v.stock - item.quantity);
          }
          p.updatedAt = new Date().toISOString();
        }
      }
      if (prev.couponCode) {
        const coup = memoryCoupons.find((c) => c.code === prev.couponCode);
        if (coup) {
          coup.usedCount = (coup.usedCount ?? 0) + 1;
          coup.updatedAt = new Date().toISOString();
        }
      }
    }

    const effectivePayment =
      paymentStatus ??
      (targetStatus === "delivered" && prev.paymentMethod === "cod" ? "paid" : prev.paymentStatus);

    memoryOrders[orderIdx] = {
      ...prev,
      orderStatus: targetStatus,
      paymentStatus: effectivePayment,
      trackingNumber: trackingNumber !== undefined ? trackingNumber : prev.trackingNumber,
      updatedAt: new Date().toISOString(),
    };
    return memoryOrders[orderIdx];
  }
}
