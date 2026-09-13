import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createOrder } from "./order-create.service";
import { NotFoundError, OutOfStockError, CouponError } from "@/lib/domain/errors";
import { memoryProducts } from "@/lib/repositories/memory-store";

describe("Order Creation Domain Service", () => {
  it("should throw an error when trying to create order without items", async () => {
    await assert.rejects(
      async () => {
        await createOrder({
          orderNumber: "TEST-EMPTY",
          customerName: "أحمد علي",
          customerPhone: "01012345678",
          governorate: "القاهرة",
          city: "مدينة نصر",
          address: "شارع عباس العقاد",
          paymentMethod: "cod",
          items: [],
        });
      },
      (err: unknown) => (err as Error).message.includes("لا يمكن إنشاء طلب بدون منتجات")
    );
  });

  it("should throw NotFoundError when product does not exist in inventory", async () => {
    await assert.rejects(
      async () => {
        await createOrder({
          orderNumber: "TEST-NOTFOUND",
          customerName: "محمود حسن",
          customerPhone: "01123456789",
          governorate: "الجيزة",
          city: "الدقي",
          address: "ميدان المساحة",
          paymentMethod: "cod",
          items: [
            {
              productId: 999999, // Non-existent product ID
              name: "منتج غير موجود",
              size: "L",
              color: "أسود",
              price: 500,
              quantity: 1,
            },
          ],
        });
      },
      (err: unknown) => err instanceof NotFoundError
    );
  });

  it("should throw OutOfStockError when requested quantity exceeds available stock", async () => {
    const existingProd = memoryProducts[0];
    assert.ok(existingProd, "Initial product fixture must exist");

    await assert.rejects(
      async () => {
        await createOrder({
          orderNumber: "TEST-OVERSTOCK",
          customerName: "كريم يوسف",
          customerPhone: "01234567890",
          governorate: "الإسكندرية",
          city: "سموحة",
          address: "شارع فوزي معاذ",
          paymentMethod: "cod",
          items: [
            {
              productId: existingProd.id,
              name: existingProd.name,
              size: existingProd.sizes[0] || "L",
              color: existingProd.colors[0]?.name || "أسود",
              price: existingProd.price,
              quantity: existingProd.stock + 999, // Exceeds available stock
            },
          ],
        });
      },
      (err: unknown) => err instanceof OutOfStockError
    );
  });

  it("should throw CouponError when applied coupon code is invalid", async () => {
    const existingProd = memoryProducts[0];
    await assert.rejects(
      async () => {
        await createOrder({
          orderNumber: "TEST-BADCOUPON",
          customerName: "ياسر إبراهيم",
          customerPhone: "01512345678",
          governorate: "القاهرة",
          city: "المعادي",
          address: "شارع 9",
          paymentMethod: "cod",
          couponCode: "FAKE_COUPON_999",
          items: [
            {
              productId: existingProd.id,
              name: existingProd.name,
              size: existingProd.sizes[0] || "L",
              color: existingProd.colors[0]?.name || "أسود",
              price: existingProd.price,
              quantity: 1,
            },
          ],
        });
      },
      (err: unknown) => err instanceof CouponError
    );
  });

  it("should successfully create order and return valid OrderItem", async () => {
    const existingProd = memoryProducts[0];
    const initialStock = existingProd.stock;

    const order = await createOrder({
      orderNumber: "TEST-SUCCESS-001",
      customerName: "عمر خالد",
      customerPhone: "01099887766",
      governorate: "القاهرة",
      city: "التجمع الخامس",
      address: "شارع التسعين الجنوبي",
      paymentMethod: "cod",
      items: [
        {
          productId: existingProd.id,
          name: existingProd.name,
          size: existingProd.sizes[0] || "L",
          color: existingProd.colors[0]?.name || "أسود",
          price: existingProd.price,
          quantity: 1,
        },
      ],
    });

    assert.equal(order.orderNumber, "TEST-SUCCESS-001");
    assert.equal(order.customerName, "عمر خالد");
    assert.equal(order.customerPhone, "01099887766");
    assert.equal(order.orderStatus, "new");
    assert.ok(order.total > 0);
    assert.equal(order.items.length, 1);
    assert.equal(existingProd.stock, initialStock - 1);
  });
});
