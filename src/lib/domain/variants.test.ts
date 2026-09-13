import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { findMatchingVariant, getEffectivePrice, getEffectiveStock } from "./variants";

describe("Domain Product Variants Logic", () => {
  const mockVariants = [
    { id: 1, size: "L", colorName: "أسود", stock: 5, price: 450 },
    { id: 2, size: "XL", colorName: "أبيض", stock: 0, price: null },
    { id: 3, size: "m", colorName: "كحلي ", stock: 12, price: 500 },
  ];

  describe("findMatchingVariant", () => {
    it("should find variant matching size and color regardless of casing or whitespace", () => {
      const match = findMatchingVariant(mockVariants, " l ", "أسود");
      assert.ok(match);
      assert.strictEqual(match.id, 1);
    });

    it("should find variant when size is lowercase in data and uppercase in query", () => {
      const match = findMatchingVariant(mockVariants, "M", "كحلي");
      assert.ok(match);
      assert.strictEqual(match.id, 3);
    });

    it("should return undefined if variant does not exist", () => {
      const match = findMatchingVariant(mockVariants, "S", "أحمر");
      assert.strictEqual(match, undefined);
    });

    it("should return undefined if variants array is empty or undefined", () => {
      assert.strictEqual(findMatchingVariant(undefined, "L", "أسود"), undefined);
      assert.strictEqual(findMatchingVariant([], "L", "أسود"), undefined);
    });
  });

  describe("getEffectivePrice", () => {
    it("should use variant price if provided", () => {
      const price = getEffectivePrice({ price: 400, salePrice: 350 }, { price: 450 });
      assert.strictEqual(price, 450);
    });

    it("should fallback to product salePrice if variant price is null/undefined", () => {
      const price = getEffectivePrice({ price: 400, salePrice: 350 }, { price: null });
      assert.strictEqual(price, 350);
    });

    it("should fallback to product price if neither variant price nor salePrice exists", () => {
      const price = getEffectivePrice({ price: 400, salePrice: undefined }, undefined);
      assert.strictEqual(price, 400);
    });
  });

  describe("getEffectiveStock", () => {
    it("should use variant stock if variant is provided", () => {
      const stock = getEffectiveStock({ stock: 20 }, { stock: 5 });
      assert.strictEqual(stock, 5);
    });

    it("should fallback to product stock if variant is undefined", () => {
      const stock = getEffectiveStock({ stock: 20 }, undefined);
      assert.strictEqual(stock, 20);
    });

    it("should never return negative stock", () => {
      const stock = getEffectiveStock({ stock: -5 }, undefined);
      assert.strictEqual(stock, 0);
    });
  });
});
