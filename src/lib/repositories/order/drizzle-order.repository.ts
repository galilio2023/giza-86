import { OrderItem } from "@/types";
import { db, dbPool } from "@/db";
import { orders, products, coupons, productVariants, orderItems } from "@/db/schema";
import { eq, desc, and, sql, or, ilike } from "drizzle-orm";
import { normalizeEgyptianPhone } from "@/lib/egypt-constants";
import { OutOfStockError, CouponError } from "@/lib/domain/errors";
import { validateStatusTransition } from "@/lib/domain/orders";
import {
  IOrderRepository,
  GetOrdersOptions,
  OrdersPageResult,
  TrackOrderResult,
  PersistOrderInput,
  UpdateOrderStatusInput,
} from "./order.interface";
import { buildOrderConditions } from "./order.conditions";

export class DrizzleOrderRepository implements IOrderRepository {
  async findMany(options?: GetOrdersOptions): Promise<OrderItem[]> {
    const conditions = buildOrderConditions(options);

    let query = db.select().from(orders).$dynamic();
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(orders.createdAt));

    if (options?.limit && options.limit > 0) {
      query = query.limit(Math.min(200, options.limit));
    }
    if (options?.offset && options.offset > 0) {
      query = query.offset(options.offset);
    }

    const rows = await query;

    return rows.map((r) => ({
      id: r.id,
      orderNumber: r.orderNumber,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      alternatePhone: r.alternatePhone ?? undefined,
      governorate: r.governorate,
      city: r.city,
      address: r.address,
      notes: r.notes ?? undefined,
      paymentMethod: r.paymentMethod as OrderItem["paymentMethod"],
      paymentStatus: r.paymentStatus as OrderItem["paymentStatus"],
      orderStatus: r.orderStatus as OrderItem["orderStatus"],
      items: r.items,
      subtotal: Number(r.subtotal),
      shippingFee: Number(r.shippingFee),
      discount: Number(r.discount || 0),
      couponCode: r.couponCode ?? undefined,
      total: Number(r.total),
      trackingNumber: r.trackingNumber ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }));
  }

  async findWithCount(options?: GetOrdersOptions): Promise<OrdersPageResult> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    const conditions = buildOrderConditions(options);

    let countQuery = db.select({ count: sql<number>`COUNT(*)::int` }).from(orders).$dynamic();
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const [[countRow], items] = await Promise.all([
      countQuery,
      this.findMany(options),
    ]);

    return {
      orders: items,
      total: countRow?.count || 0,
      limit,
      offset,
    };
  }

  async findById(orderNumberOrId: string | number, allowNumericId = false): Promise<OrderItem | null> {
    const idStr = String(orderNumberOrId).trim();
    const idStrUpper = idStr.toUpperCase();
    const idNum = Number(idStr);

    const condition =
      allowNumericId && !isNaN(idNum)
        ? or(eq(orders.id, idNum), eq(orders.orderNumber, idStr), eq(orders.orderNumber, idStrUpper))
        : or(eq(orders.orderNumber, idStr), eq(orders.orderNumber, idStrUpper));

    const rows = await db
      .select()
      .from(orders)
      .where(condition)
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      orderNumber: r.orderNumber,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      alternatePhone: r.alternatePhone ?? undefined,
      governorate: r.governorate,
      city: r.city,
      address: r.address,
      notes: r.notes ?? undefined,
      paymentMethod: r.paymentMethod as OrderItem["paymentMethod"],
      paymentStatus: r.paymentStatus as OrderItem["paymentStatus"],
      orderStatus: r.orderStatus as OrderItem["orderStatus"],
      items: r.items,
      subtotal: Number(r.subtotal),
      shippingFee: Number(r.shippingFee),
      discount: Number(r.discount || 0),
      couponCode: r.couponCode ?? undefined,
      total: Number(r.total),
      trackingNumber: r.trackingNumber ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    };
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    const rows = await db
      .select({
        status: orders.orderStatus,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(orders)
      .groupBy(orders.orderStatus);

    const counts: Record<string, number> = { all: 0 };
    for (const r of rows) {
      counts[r.status] = Number(r.count);
      counts.all = (counts.all || 0) + Number(r.count);
    }
    return counts;
  }

  async track(orderNumber: string, phone: string): Promise<TrackOrderResult | null> {
    const cleanOrderNum = orderNumber.trim();
    const normalizedPhone = normalizeEgyptianPhone(phone);
    if (!cleanOrderNum || !normalizedPhone) return null;

    const cleanUpper = cleanOrderNum.toUpperCase();
    const phoneSuffix = normalizedPhone.slice(-10);

    const rows = await db
      .select()
      .from(orders)
      .where(
        and(
          or(eq(orders.orderNumber, cleanOrderNum), eq(orders.orderNumber, cleanUpper)),
          or(
            eq(orders.customerPhone, normalizedPhone),
            eq(orders.alternatePhone, normalizedPhone),
            ilike(orders.customerPhone, `%${phoneSuffix}%`),
            ilike(orders.alternatePhone, `%${phoneSuffix}%`)
          )
        )
      )
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      orderNumber: r.orderNumber,
      orderStatus: r.orderStatus as OrderItem["orderStatus"],
      paymentStatus: r.paymentStatus as OrderItem["paymentStatus"],
      paymentMethod: r.paymentMethod as OrderItem["paymentMethod"],
      customerName: r.customerName,
      governorate: r.governorate,
      city: r.city,
      address: r.address,
      trackingNumber: r.trackingNumber ?? undefined,
      items: r.items,
      subtotal: Number(r.subtotal),
      shippingFee: Number(r.shippingFee),
      discount: Number(r.discount || 0),
      total: Number(r.total),
      createdAt: r.createdAt.toISOString(),
    };
  }

  async create(data: PersistOrderInput): Promise<OrderItem> {
    return await (dbPool || db).transaction(async (tx) => {
      let appliedCouponCode: string | undefined = undefined;

      if (data.couponCode?.trim()) {
        const cleanCode = data.couponCode.trim().toUpperCase();
        const reserved = await tx
          .update(coupons)
          .set({
            usedCount: sql`${coupons.usedCount} + 1`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(coupons.code, cleanCode),
              eq(coupons.isActive, true),
              or(sql`${coupons.usageLimit} IS NULL`, sql`${coupons.usedCount} < ${coupons.usageLimit}`)
            )
          )
          .returning({
            code: coupons.code,
          });

        if (reserved.length === 0) {
          throw new CouponError(`نعتذر، وصل الكوبون "${cleanCode}" للحد الأقصى لمرات الاستخدام أثناء تأكيد الطلب.`);
        }

        appliedCouponCode = reserved[0].code;
      }

      for (const vd of data.variantDeductions) {
        const updatedVar = await tx
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} - ${vd.quantity}`,
            updatedAt: new Date(),
          })
          .where(and(eq(productVariants.id, vd.variantId), sql`${productVariants.stock} >= ${vd.quantity}`))
          .returning({ id: productVariants.id });

        if (updatedVar.length === 0) {
          throw new OutOfStockError("نفدت الكمية المطلوبة من أحد المقاسات المختارة أثناء إتمام الطلب.");
        }
      }

      for (const pd of data.productDeductions) {
        const updatedProd = await tx
          .update(products)
          .set({
            stock: sql`GREATEST(0, ${products.stock} - ${pd.quantity})`,
            updatedAt: new Date(),
          })
          .where(and(eq(products.id, pd.productId), sql`${products.stock} >= ${pd.quantity}`))
          .returning({ id: products.id });

        if (updatedProd.length === 0) {
          throw new OutOfStockError("نفدت كمية أحد المنتجات المطلوبة أثناء تأكيد الطلب.");
        }
      }

      const [inserted] = await tx
        .insert(orders)
        .values({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          customerPhone: normalizeEgyptianPhone(data.customerPhone),
          alternatePhone: data.alternatePhone && data.alternatePhone.trim() ? normalizeEgyptianPhone(data.alternatePhone) : null,
          governorate: data.governorate,
          city: data.city,
          address: data.address,
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus || "pending",
          orderStatus: data.orderStatus || "new",
          items: data.items,
          subtotal: data.subtotal.toFixed(2),
          shippingFee: data.shippingFee.toFixed(2),
          discount: data.discount.toFixed(2),
          couponCode: appliedCouponCode,
          total: data.total.toFixed(2),
        })
        .returning();

      if (data.items.length > 0) {
        await tx.insert(orderItems).values(
          data.items.map((vi) => ({
            orderId: inserted.id,
            productId: vi.productId,
            variantId: vi.variantId || null,
            name: vi.name,
            size: vi.size,
            color: vi.color,
            price: vi.price.toFixed(2),
            quantity: vi.quantity,
            image: vi.image,
          }))
        );
      }

      return {
        id: inserted.id,
        orderNumber: inserted.orderNumber,
        customerName: inserted.customerName,
        customerPhone: inserted.customerPhone,
        alternatePhone: inserted.alternatePhone ?? undefined,
        governorate: inserted.governorate,
        city: inserted.city,
        address: inserted.address,
        notes: inserted.notes ?? undefined,
        paymentMethod: inserted.paymentMethod as OrderItem["paymentMethod"],
        paymentStatus: inserted.paymentStatus as OrderItem["paymentStatus"],
        orderStatus: inserted.orderStatus as OrderItem["orderStatus"],
        items: inserted.items,
        subtotal: Number(inserted.subtotal),
        shippingFee: Number(inserted.shippingFee),
        discount: Number(inserted.discount || 0),
        couponCode: inserted.couponCode ?? undefined,
        total: Number(inserted.total),
        trackingNumber: inserted.trackingNumber ?? undefined,
        createdAt: inserted.createdAt.toISOString(),
        updatedAt: inserted.updatedAt?.toISOString(),
      };
    });
  }

  async updateStatus(idOrOrderNumber: number | string, input: UpdateOrderStatusInput): Promise<OrderItem | null> {
    const { orderStatus, paymentStatus, trackingNumber } = input;
    const numId = typeof idOrOrderNumber === "number" ? idOrOrderNumber : Number(idOrOrderNumber);
    const condition = !isNaN(numId)
      ? or(eq(orders.id, numId), eq(orders.orderNumber, String(idOrOrderNumber)))
      : eq(orders.orderNumber, String(idOrOrderNumber));

    const previousRows = await db.select().from(orders).where(condition).limit(1);
    if (previousRows.length === 0) return null;
    const prevOrder = previousRows[0];

    const targetOrderStatus = orderStatus || (prevOrder.orderStatus as OrderItem["orderStatus"]);

    if (orderStatus && orderStatus !== prevOrder.orderStatus) {
      validateStatusTransition(prevOrder.orderStatus as OrderItem["orderStatus"], orderStatus);
    }

    const wasCancelledOrReturned = prevOrder.orderStatus === "cancelled" || prevOrder.orderStatus === "returned";
    const isNowCancelledOrReturned = targetOrderStatus === "cancelled" || targetOrderStatus === "returned";

    const itemsByProduct = new Map<number, number>();
    const itemsByVariant = new Map<number, { qty: number; name: string }>();
    for (const item of (prevOrder.items as OrderItem["items"])) {
      itemsByProduct.set(item.productId, (itemsByProduct.get(item.productId) || 0) + item.quantity);
      if (item.variantId) {
        const existing = itemsByVariant.get(item.variantId);
        itemsByVariant.set(item.variantId, {
          qty: (existing?.qty || 0) + item.quantity,
          name: item.name,
        });
      }
    }

    return await (dbPool || db).transaction(async (tx) => {
      if (!wasCancelledOrReturned && isNowCancelledOrReturned) {
        for (const [variantId, vData] of itemsByVariant.entries()) {
          await tx
            .update(productVariants)
            .set({
              stock: sql`${productVariants.stock} + ${vData.qty}`,
              updatedAt: new Date(),
            })
            .where(eq(productVariants.id, variantId));
        }

        for (const [productId, qty] of itemsByProduct.entries()) {
          await tx
            .update(products)
            .set({
              stock: sql`${products.stock} + ${qty}`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, productId));
        }

        if (prevOrder.couponCode) {
          await tx
            .update(coupons)
            .set({
              usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)`,
              updatedAt: new Date(),
            })
            .where(eq(coupons.code, prevOrder.couponCode));
        }
      } else if (wasCancelledOrReturned && !isNowCancelledOrReturned) {
        for (const [variantId, vData] of itemsByVariant.entries()) {
          const updatedVar = await tx
            .update(productVariants)
            .set({
              stock: sql`${productVariants.stock} - ${vData.qty}`,
              updatedAt: new Date(),
            })
            .where(and(eq(productVariants.id, variantId), sql`${productVariants.stock} >= ${vData.qty}`))
            .returning({ id: productVariants.id });

          if (updatedVar.length === 0) {
            throw new OutOfStockError(
              `تعذر إعادة تنشيط الطلب: نفدت كمية المقاس واللون المختارين للمنتج "${vData.name}" (المطلوب: ${vData.qty} قطعة).`
            );
          }
        }

        for (const [productId, qty] of itemsByProduct.entries()) {
          const updatedProd = await tx
            .update(products)
            .set({
              stock: sql`${products.stock} - ${qty}`,
              updatedAt: new Date(),
            })
            .where(and(eq(products.id, productId), sql`${products.stock} >= ${qty}`))
            .returning({ id: products.id });

          if (updatedProd.length === 0) {
            throw new OutOfStockError(
              "تعذر إعادة تنشيط الطلب: نفدت كمية أحد المنتجات المطلوبة من المخزن."
            );
          }
        }

        if (prevOrder.couponCode) {
          await tx
            .update(coupons)
            .set({
              usedCount: sql`${coupons.usedCount} + 1`,
              updatedAt: new Date(),
            })
            .where(eq(coupons.code, prevOrder.couponCode));
        }
      }

      const effectivePaymentStatus = paymentStatus ?? (
        targetOrderStatus === "delivered" && prevOrder.paymentMethod === "cod" ? "paid" : undefined
      );

      const [updated] = await tx
        .update(orders)
        .set({
          orderStatus: targetOrderStatus,
          paymentStatus: effectivePaymentStatus,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
          updatedAt: new Date(),
        })
        .where(and(eq(orders.id, prevOrder.id), eq(orders.orderStatus, prevOrder.orderStatus)))
        .returning();

      if (!updated) {
        throw new Error("تعذر تحديث حالة الطلب نظراً لتعديله بالتزامن من قبل مستخدم آخر. يرجى تحديث الصفحة والمحاولة ثانية.");
      }

      return {
        id: updated.id,
        orderNumber: updated.orderNumber,
        customerName: updated.customerName,
        customerPhone: updated.customerPhone,
        alternatePhone: updated.alternatePhone ?? undefined,
        governorate: updated.governorate,
        city: updated.city,
        address: updated.address,
        notes: updated.notes ?? undefined,
        paymentMethod: updated.paymentMethod as OrderItem["paymentMethod"],
        paymentStatus: updated.paymentStatus as OrderItem["paymentStatus"],
        orderStatus: updated.orderStatus as OrderItem["orderStatus"],
        items: updated.items,
        subtotal: Number(updated.subtotal),
        shippingFee: Number(updated.shippingFee),
        discount: Number(updated.discount || 0),
        couponCode: updated.couponCode ?? undefined,
        total: Number(updated.total),
        trackingNumber: updated.trackingNumber ?? undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt?.toISOString(),
      };
    });
  }
}
