import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateDiscount,
  getDiscountPercentage,
  calculateShippingFee,
  calculateOrderTotal,
} from "./pricing";

describe("Domain Pricing Logic", () => {
  describe("calculateDiscount", () => {
    it("should calculate percentage discount correctly", () => {
      assert.equal(calculateDiscount(500, "percentage", 10), 50);
      assert.equal(calculateDiscount(1000, "percentage", 25), 250);
    });

    it("should clamp percentage to maximum 100%", () => {
      assert.equal(calculateDiscount(500, "percentage", 150), 500);
    });

    it("should calculate fixed discount correctly", () => {
      assert.equal(calculateDiscount(500, "fixed", 100), 100);
    });

    it("should cap fixed discount to subtotal to prevent negative totals", () => {
      assert.equal(calculateDiscount(80, "fixed", 150), 80);
    });

    it("should return 0 when subtotal or discountValue is zero or negative", () => {
      assert.equal(calculateDiscount(0, "percentage", 20), 0);
      assert.equal(calculateDiscount(-100, "fixed", 50), 0);
      assert.equal(calculateDiscount(500, "fixed", -10), 0);
    });
  });

  describe("getDiscountPercentage", () => {
    it("should calculate discount percentage between regular and sale price", () => {
      assert.equal(getDiscountPercentage(500, 400), 20);
      assert.equal(getDiscountPercentage(1000, 750), 25);
    });

    it("should return 0 if salePrice is missing or greater/equal to price", () => {
      assert.equal(getDiscountPercentage(500, null), 0);
      assert.equal(getDiscountPercentage(500, 500), 0);
      assert.equal(getDiscountPercentage(500, 600), 0);
    });
  });

  describe("calculateShippingFee", () => {
    it("should grant free shipping when subtotal reaches freeShippingThreshold", () => {
      assert.equal(calculateShippingFee(1500, "القاهرة", 1200), 0);
      assert.equal(calculateShippingFee(1200, "الإسكندرية", 1200), 0);
    });

    it("should return standard governorate rate when below threshold", () => {
      // Cairo standard rate is 45
      assert.equal(calculateShippingFee(500, "القاهرة", 1200), 45);
      // Alexandria standard rate is 55
      assert.equal(calculateShippingFee(500, "الإسكندرية", 1200), 55);
    });

    it("should use custom governorate rate override if provided", () => {
      const customRates = { "القاهرة": 40, "الإسكندرية": 55 };
      assert.equal(calculateShippingFee(500, "القاهرة", 1200, customRates), 40);
      assert.equal(calculateShippingFee(500, "الإسكندرية", 1200, customRates), 55);
    });
  });

  describe("calculateOrderTotal", () => {
    it("should calculate total = subtotal + shipping - discount", () => {
      assert.equal(calculateOrderTotal(500, 50, 50), 500);
      assert.equal(calculateOrderTotal(1000, 0, 150), 850);
    });

    it("should never return negative total", () => {
      assert.equal(calculateOrderTotal(100, 50, 300), 0);
    });
  });
});
