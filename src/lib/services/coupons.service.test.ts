import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateCoupon } from "./coupons.service";

describe("Coupon Validation Domain Service", () => {
  it("should return invalid when coupon code does not exist", async () => {
    const result = await validateCoupon("NONEXISTENT_CODE_123", 1000);
    assert.equal(result.valid, false);
    assert.equal(result.discount, 0);
    assert.match(result.message, /غير موجود أو غير صالح/);
  });

  it("should return invalid when order subtotal is below minOrderValue", async () => {
    // EGYPT20 has minOrderValue: 600
    const result = await validateCoupon("EGYPT20", 300);
    assert.equal(result.valid, false);
    assert.equal(result.discount, 0);
    assert.match(result.message, /الحد الأدنى لتفعيل هذا الكوبون/);
  });

  it("should validate and calculate percentage discount correctly", async () => {
    // EGYPT20 has 20% discount on order above 600
    const result = await validateCoupon("egypt20", 1000);
    assert.equal(result.valid, true);
    assert.equal(result.discount, 200); // 20% of 1000
    assert.match(result.message, /20%/);
  });

  it("should validate and calculate fixed discount correctly", async () => {
    // WELCOME50 has fixed 50 EGP discount on order above 400
    const result = await validateCoupon("welcome50", 500);
    assert.equal(result.valid, true);
    assert.equal(result.discount, 50);
    assert.match(result.message, /50 ج\.م/);
  });
});
