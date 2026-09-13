import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MemoryProductRepository } from "./memory-product.repository";
import { memoryProducts } from "../memory-store";

describe("Product Repository Slug & ID Lookup", () => {
  const repo = new MemoryProductRepository();

  it("should find product with Arabic slug using raw Arabic characters", async () => {
    // Add temporary Arabic-slugged test product
    const arabicProd = {
      id: 9991,
      name: "شنطة يد كاجوال",
      slug: "شنط",
      description: "شنطة قطنية",
      price: 250,
      stock: 10,
      categoryId: 1,
      sizes: ["One Size"],
      colors: [{ name: "أسود", hex: "#000000" }],
      images: ["https://example.com/bag.jpg"],
      isFeatured: false,
      isNew: true,
      variants: [],
    };
    memoryProducts.push(arabicProd);

    const found = await repo.findById("شنط");
    assert.ok(found, "Should find product by raw Arabic slug 'شنط'");
    assert.strictEqual(found.id, 9991);
    assert.strictEqual(found.name, "شنطة يد كاجوال");
  });

  it("should find product with Arabic slug using URL-encoded slug (%D8%B4%D9%86%D8%B7)", async () => {
    const encoded = encodeURIComponent("شنط"); // "%D8%B4%D9%86%D8%B7"
    const found = await repo.findById(encoded);
    assert.ok(found, "Should find product by URL-encoded slug '%D8%B4%D9%86%D8%B7'");
    assert.strictEqual(found.id, 9991);
  });

  it("should find product by numeric ID as string or number", async () => {
    const foundByNum = await repo.findById(9991);
    assert.ok(foundByNum);
    assert.strictEqual(foundByNum.id, 9991);

    const foundByStr = await repo.findById("9991");
    assert.ok(foundByStr);
    assert.strictEqual(foundByStr.id, 9991);
  });

  it("should return null for non-existent slugs", async () => {
    const notFound = await repo.findById("غير-موجود");
    assert.strictEqual(notFound, null);
  });
});
