import { OrderItem } from "@/types";
import {
  getOrderRepository,
  CreateOrderInput,
  PersistOrderInput,
} from "@/lib/repositories/order.repository";
import { getProductRepository } from "@/lib/repositories/product.repository";
import { getSettingsRepository } from "@/lib/repositories/settings.repository";
import { validateCoupon } from "@/lib/services/coupons.service";
import { calculateShippingFee, calculateOrderTotal } from "@/lib/domain/pricing";
import { findMatchingVariant } from "@/lib/domain/variants";
import { OutOfStockError, StoreClosedError, CouponError, NotFoundError } from "@/lib/domain/errors";

export type { CreateOrderInput, PersistOrderInput };

/**
 * Domain Application Service to process and orchestrate checkout orders.
 * Validates store acceptance, payment methods, inventory availability,
 * anti-tampering pricing, and coupon discounts before delegating atomic persistence
 * to the repository layer.
 */
export async function createOrder(data: CreateOrderInput): Promise<OrderItem> {
  // 1. Basic Items Validation
  if (!data.items || data.items.length === 0) {
    throw new Error("لا يمكن إنشاء طلب بدون منتجات");
  }

  // 2. Settings & Store Status
  const settings = await getSettingsRepository().get();
  if (!settings.isAcceptingOrders) {
    throw new StoreClosedError(
      settings.orderClosedMessage || "نعتذر عن استقبال طلبات جديدة مؤقتاً بسبب الإجازة أو جرد المخزون."
    );
  }

  // 3. Payment Method Enabled Verification
  if (settings.enabledPaymentMethods && !settings.enabledPaymentMethods.includes(data.paymentMethod)) {
    throw new Error("طريقة الدفع المختارة غير مفعلة حالياً في المتجر.");
  }

  // 4. Consolidate Duplicate Items in Cart
  const consolidatedItems: typeof data.items = [];
  const itemKeyMap = new Map<string, number>();
  for (const item of data.items) {
    const key = `${item.productId}-${item.size.trim().toUpperCase()}-${item.color.trim().toLowerCase()}`;
    const existingIdx = itemKeyMap.get(key);
    if (existingIdx !== undefined) {
      consolidatedItems[existingIdx].quantity += item.quantity;
    } else {
      itemKeyMap.set(key, consolidatedItems.length);
      consolidatedItems.push({ ...item });
    }
  }

  // 5. Query Products & Variants via Repository
  const productRepo = getProductRepository();
  const uniqueProductIds = Array.from(new Set(consolidatedItems.map((i) => i.productId)));
  const productsList = await Promise.all(uniqueProductIds.map((id) => productRepo.findById(id)));
  const productMap = new Map<number, NonNullable<(typeof productsList)[0]>>();
  for (let i = 0; i < uniqueProductIds.length; i++) {
    const p = productsList[i];
    if (p) productMap.set(uniqueProductIds[i], p);
  }

  // 6. Inventory & Stock Validation
  const variantDeductions: { variantId: number; quantity: number }[] = [];
  const aggregatedQuantities = new Map<number, number>();

  for (const item of consolidatedItems) {
    const p = productMap.get(item.productId);
    if (!p) {
      throw new NotFoundError(`المنتج بالرقم "${item.productId}" غير موجود في قاعدة البيانات.`);
    }

    let matchedVar = item.variantId && p.variants ? p.variants.find((v) => v.id === item.variantId) : undefined;
    if (!matchedVar && p.variants) {
      matchedVar = findMatchingVariant(p.variants, item.size, item.color);
    }

    if (matchedVar) {
      if (matchedVar.stock < item.quantity) {
        throw new OutOfStockError(
          `الكمية المطلوبة من "${p.name}" (مقاس: ${item.size}، لون: ${item.color}) غير متوفرة حالياً في المخزن (المطلوب: ${item.quantity} قطعة، المتبقي: ${matchedVar.stock} قطعة فقط).`
        );
      }
      if (matchedVar.id !== undefined) {
        variantDeductions.push({ variantId: matchedVar.id, quantity: item.quantity });
      }
    } else if (p.stock < item.quantity) {
      throw new OutOfStockError(
        `الكمية المطلوبة من "${p.name}" غير متوفرة حالياً في المخزن (المطلوب: ${item.quantity} قطعة، المتبقي: ${p.stock} قطعة فقط).`
      );
    }

    aggregatedQuantities.set(
      item.productId,
      (aggregatedQuantities.get(item.productId) || 0) + item.quantity
    );
  }

  // Verify total stock for base product
  for (const [prodId, reqQty] of aggregatedQuantities.entries()) {
    const p = productMap.get(prodId)!;
    if (p.stock < reqQty) {
      throw new OutOfStockError(
        `الكمية المطلوبة من "${p.name}" غير متوفرة حالياً في المخزن (المطلوب: ${reqQty} قطعة، المتبقي: ${p.stock} قطعة فقط).`
      );
    }
  }

  // 7. Anti-Tamper Price Calculation & Verified Item Snapshot
  let calculatedSubtotal = 0;
  const verifiedItems: OrderItem["items"] = [];

  for (const item of consolidatedItems) {
    const p = productMap.get(item.productId)!;
    let matchedVar = item.variantId && p.variants ? p.variants.find((v) => v.id === item.variantId) : undefined;
    if (!matchedVar && p.variants) {
      matchedVar = findMatchingVariant(p.variants, item.size, item.color);
    }

    const genuinePrice = matchedVar?.price
      ? Number(matchedVar.price)
      : (p.salePrice ? Number(p.salePrice) : Number(p.price));
    calculatedSubtotal += genuinePrice * item.quantity;

    verifiedItems.push({
      productId: item.productId,
      variantId: matchedVar?.id,
      name: p.name,
      size: item.size,
      color: item.color,
      price: genuinePrice,
      quantity: item.quantity,
      image: item.image || matchedVar?.imageUrl || p.images?.[0] || "",
    });
  }

  // 8. Coupon Validation & Discount
  let calculatedDiscount = 0;
  let appliedCouponCode: string | undefined = undefined;

  if (data.couponCode?.trim()) {
    const couponValidation = await validateCoupon(data.couponCode, calculatedSubtotal);
    if (!couponValidation.valid) {
      throw new CouponError(couponValidation.message);
    }
    calculatedDiscount = couponValidation.discount;
    appliedCouponCode = couponValidation.coupon?.code || data.couponCode.trim().toUpperCase();
  }

  // 9. Shipping Fee and Final Total Calculations
  const shippingFee = calculateShippingFee(
    calculatedSubtotal,
    data.governorate,
    settings.freeShippingThreshold,
    settings.governoratesShipping
  );

  const calculatedTotal = calculateOrderTotal(calculatedSubtotal, shippingFee, calculatedDiscount);

  const productDeductions = Array.from(aggregatedQuantities.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));

  // 10. Delegate Atomic Persistence to the Repository
  return getOrderRepository().create({
    orderNumber: data.orderNumber,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    alternatePhone: data.alternatePhone,
    governorate: data.governorate,
    city: data.city,
    address: data.address,
    notes: data.notes,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus || "pending",
    orderStatus: data.orderStatus || "new",
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    shippingFee,
    discount: calculatedDiscount,
    couponCode: appliedCouponCode,
    total: calculatedTotal,
    variantDeductions,
    productDeductions,
  });
}
