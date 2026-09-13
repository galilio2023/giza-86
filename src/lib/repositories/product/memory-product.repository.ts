import { ProductItem, ProductVariantItem } from "@/types";
import { memoryProducts, memoryCategories } from "../memory-store";
import { INITIAL_PRODUCTS, buildProductVariants } from "@/db/seed-data";
import { IProductRepository, GetProductsOptions, ProductsPageResult } from "./product.interface";

export class MemoryProductRepository implements IProductRepository {
  async findMany(options?: GetProductsOptions): Promise<ProductItem[]> {
    let list = [...memoryProducts];
    if (options?.categoryId !== undefined) {
      list = list.filter((p) => p.categoryId === options.categoryId);
    }
    if (options?.categorySlug) {
      const cat = memoryCategories.find((c) => c.slug === options.categorySlug);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }
    if (options?.featured) {
      list = list.filter((p) => p.isFeatured);
    }
    if (options?.onSale) {
      list = list.filter((p) => Boolean(p.salePrice && p.salePrice < p.price));
    }
    if (options?.inStock) {
      list = list.filter((p) => p.stock > 0);
    }
    if (options?.size && options.size !== "all") {
      list = list.filter((p) => p.sizes.includes(options.size!));
    }
    if (options?.minPrice !== undefined) {
      list = list.filter((p) => (p.salePrice || p.price) >= options.minPrice!);
    }
    if (options?.maxPrice !== undefined) {
      list = list.filter((p) => (p.salePrice || p.price) <= options.maxPrice!);
    }
    if (options?.search?.trim()) {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (options?.sortBy === "price-asc") {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (options?.sortBy === "price-desc") {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (options?.sortBy === "oldest") {
      list.sort((a, b) => (a.id || 0) - (b.id || 0));
    } else {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    if (options?.offset && options.offset > 0) {
      list = list.slice(options.offset);
    }
    if (options?.limit && options.limit > 0) {
      list = list.slice(0, options.limit);
    }

    return list.map((p) => {
      const cat = memoryCategories.find((c) => c.id === p.categoryId);
      return {
        ...p,
        categoryName: cat?.name,
        categorySlug: cat?.slug,
      };
    });
  }

  async findWithCount(options?: GetProductsOptions): Promise<ProductsPageResult> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    const allMatching = await this.findMany({ ...options, limit: undefined, offset: undefined });
    const paginated = allMatching.slice(offset, offset + limit);
    return {
      products: paginated,
      total: allMatching.length,
      limit,
      offset,
    };
  }

  async findById(idOrSlug: string | number): Promise<ProductItem | null> {
    const id = Number(idOrSlug);
    if (!isNaN(id)) {
      const found = memoryProducts.find((p) => p.id === id);
      if (found) return found;
    }
    const foundBySlug = memoryProducts.find((p) => p.slug === idOrSlug);
    if (foundBySlug) return foundBySlug;

    const seedFound = INITIAL_PRODUCTS.find((p) => (!isNaN(id) && p.id === id) || p.slug === idOrSlug);
    if (!seedFound) return null;

    const cat = memoryCategories.find((c) => c.id === seedFound.categoryId);
    const variants = buildProductVariants(
      seedFound.id,
      seedFound.sku || `SKU-${seedFound.id}`,
      seedFound.sizes,
      seedFound.colors,
      seedFound.salePrice || seedFound.price
    );

    return {
      ...seedFound,
      categoryName: cat?.name,
      categorySlug: cat?.slug,
      variants,
    };
  }

  async getRelated(categoryId: number, currentProductId: number, limit = 4): Promise<ProductItem[]> {
    return memoryProducts
      .filter((p) => p.categoryId === categoryId && p.id !== currentProductId)
      .slice(0, limit);
  }

  async getLowStock(threshold = 5, limit = 10): Promise<ProductItem[]> {
    return memoryProducts
      .filter((p) => p.stock <= threshold)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, limit);
  }

  async create(data: Omit<ProductItem, "id" | "createdAt" | "updatedAt">): Promise<ProductItem> {
    const cleanSku = data.sku && data.sku.trim() ? data.sku.trim().toUpperCase() : null;
    const initialVariants = data.variants && data.variants.length > 0
      ? data.variants
      : buildProductVariants(
          0,
          cleanSku || "SKU",
          data.sizes,
          data.colors,
          data.salePrice || data.price
        );

    const totalStock = initialVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const newId = Date.now();
    const slug = data.slug || `prod-${newId}`;
    const productVariantsWithId: ProductVariantItem[] = initialVariants.map((v, idx) => ({
      ...v,
      id: newId * 100 + idx,
      productId: newId,
      sku: v.sku || `${cleanSku || "SKU"}-${v.size}-${v.colorName}-${idx}`,
    }));

    const newProd: ProductItem = {
      ...data,
      id: newId,
      slug,
      sku: cleanSku || undefined,
      stock: totalStock,
      variants: productVariantsWithId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryProducts.unshift(newProd);
    return newProd;
  }

  async update(id: number, data: Partial<ProductItem>): Promise<ProductItem | null> {
    const idx = memoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const hasNewVariants = data.variants !== undefined && Array.isArray(data.variants);
    const computedStock = hasNewVariants
      ? data.variants!.reduce((sum, v) => sum + (v.stock || 0), 0)
      : data.stock;

    const cleaned = { ...data };
    if (cleaned.salePrice === 0) cleaned.salePrice = undefined;
    if (cleaned.fabricDetails === "") cleaned.fabricDetails = undefined;
    if (cleaned.sku === "") cleaned.sku = undefined;
    if (hasNewVariants) cleaned.stock = computedStock;

    memoryProducts[idx] = {
      ...memoryProducts[idx],
      ...cleaned,
      updatedAt: new Date().toISOString(),
    };
    return memoryProducts[idx];
  }

  async delete(id: number): Promise<boolean> {
    const idx = memoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    memoryProducts.splice(idx, 1);
    return true;
  }
}
