import { ProductItem, ProductVariantItem } from "@/types";
import { db, dbPool } from "@/db";
import { products, categories, productVariants } from "@/db/schema";
import { eq, ne, desc, asc, and, or, sql, lte, inArray } from "drizzle-orm";
import { buildProductVariants } from "@/db/seed-data";
import { IProductRepository, GetProductsOptions, ProductsPageResult } from "./product.interface";
import { buildProductConditions } from "./product.conditions";
import { optimizeCloudinaryUrl } from "@/lib/utils";

function mapImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return (images as string[]).map(optimizeCloudinaryUrl);
}

export class DrizzleProductRepository implements IProductRepository {
  async findMany(options?: GetProductsOptions): Promise<ProductItem[]> {
    const conditions = buildProductConditions(options);

    let query = db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        fabricDetails: products.fabricDetails,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        sizes: products.sizes,
        colors: products.colors,
        images: products.images,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        sku: products.sku,
        hasSizeGuide: products.hasSizeGuide,
        badgeText: products.badgeText,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .$dynamic();

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (options?.sortBy === "price-asc") {
      query = query.orderBy(asc(sql`COALESCE(${products.salePrice}, ${products.price})`), asc(products.id));
    } else if (options?.sortBy === "price-desc") {
      query = query.orderBy(desc(sql`COALESCE(${products.salePrice}, ${products.price})`), desc(products.id));
    } else if (options?.sortBy === "oldest") {
      query = query.orderBy(asc(products.createdAt), asc(products.id));
    } else {
      query = query.orderBy(desc(products.createdAt), desc(products.id));
    }

    if (options?.limit && options.limit > 0) {
      query = query.limit(Math.min(100, options.limit));
    }
    if (options?.offset && options.offset > 0) {
      query = query.offset(options.offset);
    }

    const rows = await query;

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      fabricDetails: r.fabricDetails ?? undefined,
      price: Number(r.price),
      salePrice: r.salePrice ? Number(r.salePrice) : undefined,
      stock: r.stock,
      categoryId: r.categoryId ?? 1,
      categoryName: r.categoryName ?? undefined,
      categorySlug: r.categorySlug ?? undefined,
      sizes: (r.sizes as string[]) || ["S", "M", "L", "XL", "2XL"],
      colors: (r.colors as { name: string; hex: string }[]) || [],
      images: mapImages(r.images),
      isFeatured: r.isFeatured ?? false,
      isNew: r.isNew ?? false,
      sku: r.sku ?? undefined,
      hasSizeGuide: r.hasSizeGuide !== null && r.hasSizeGuide !== undefined
        ? Boolean(r.hasSizeGuide)
        : (Array.isArray(r.sizes) && (r.sizes as string[]).some((s) => ["S", "M", "L", "XL", "2XL", "3XL"].includes(String(s).trim().toUpperCase()))),
      badgeText: r.badgeText || undefined,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }));
  }

  async findWithCount(options?: GetProductsOptions): Promise<ProductsPageResult> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    const conditions = buildProductConditions(options);

    let countQuery = db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .$dynamic();

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const [[countRow], items] = await Promise.all([
      countQuery,
      this.findMany(options),
    ]);

    return {
      products: items,
      total: countRow?.count || 0,
      limit,
      offset,
    };
  }

  async findById(idOrSlug: string | number): Promise<ProductItem | null> {
    const raw = String(idOrSlug).trim();
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // ignore malformed URI components
    }

    const numId = Number(raw);
    const isNum = !isNaN(numId) && Number.isInteger(numId) && numId > 0 && String(numId) === raw;

    const slugCandidates = Array.from(new Set([raw, decoded])).filter(Boolean);

    const condition = isNum
      ? or(eq(products.id, numId), inArray(products.slug, slugCandidates))
      : slugCandidates.length > 1
      ? inArray(products.slug, slugCandidates)
      : eq(products.slug, slugCandidates[0] || raw);

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        fabricDetails: products.fabricDetails,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        sizes: products.sizes,
        colors: products.colors,
        images: products.images,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        sku: products.sku,
        hasSizeGuide: products.hasSizeGuide,
        badgeText: products.badgeText,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(condition)
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    let variants: ProductVariantItem[] = [];
    try {
      const vRows = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, r.id));

      variants = vRows.map((v) => ({
        id: v.id,
        productId: v.productId,
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        stock: v.stock,
        price: v.price ? Number(v.price) : undefined,
        imageUrl: v.imageUrl ? optimizeCloudinaryUrl(v.imageUrl) : undefined,
        createdAt: v.createdAt?.toISOString(),
        updatedAt: v.updatedAt?.toISOString(),
      }));
    } catch (vErr) {
      console.warn("Notice: could not query variants table for product:", r.id, vErr);
    }

    if (variants.length === 0 && r.sizes && r.colors) {
      variants = buildProductVariants(
        r.id,
        r.sku || `SKU-${r.id}`,
        r.sizes as string[],
        r.colors as { name: string; hex: string; imageUrl?: string }[],
        r.salePrice ? Number(r.salePrice) : Number(r.price)
      );
    }

    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      fabricDetails: r.fabricDetails ?? undefined,
      price: Number(r.price),
      salePrice: r.salePrice ? Number(r.salePrice) : undefined,
      stock: r.stock,
      categoryId: r.categoryId ?? 1,
      categoryName: r.categoryName ?? undefined,
      categorySlug: r.categorySlug ?? undefined,
      sizes: (r.sizes as string[]) || ["S", "M", "L", "XL", "2XL"],
      colors: (r.colors as { name: string; hex: string }[]) || [],
      images: mapImages(r.images),
      isFeatured: r.isFeatured ?? false,
      isNew: r.isNew ?? false,
      sku: r.sku ?? undefined,
      hasSizeGuide: r.hasSizeGuide !== null && r.hasSizeGuide !== undefined
        ? Boolean(r.hasSizeGuide)
        : (Array.isArray(r.sizes) && (r.sizes as string[]).some((s) => ["S", "M", "L", "XL", "2XL", "3XL"].includes(String(s).trim().toUpperCase()))),
      badgeText: r.badgeText || undefined,
      variants,
      createdAt: r.createdAt?.toISOString(),
    };
  }

  /**
   * Bulk fetch products by numeric IDs in a single query.
   * Eliminates N+1 queries during checkout product validation.
   */
  async findByIds(ids: number[]): Promise<ProductItem[]> {
    if (ids.length === 0) return [];

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        fabricDetails: products.fabricDetails,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        sizes: products.sizes,
        colors: products.colors,
        images: products.images,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        sku: products.sku,
        hasSizeGuide: products.hasSizeGuide,
        badgeText: products.badgeText,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(inArray(products.id, ids));

    // Bulk-fetch all variants for these products in a single query
    let allVariantRows: (typeof productVariants.$inferSelect)[] = [];
    try {
      allVariantRows = await db
        .select()
        .from(productVariants)
        .where(inArray(productVariants.productId, ids));
    } catch (vErr) {
      console.warn("Notice: could not query variants table for products:", ids, vErr);
    }

    const variantsByProduct = new Map<number, typeof allVariantRows>();
    for (const v of allVariantRows) {
      const existing = variantsByProduct.get(v.productId) || [];
      existing.push(v);
      variantsByProduct.set(v.productId, existing);
    }

    return rows.map((r) => {
      const vRows = variantsByProduct.get(r.id) || [];
      let variants: ProductVariantItem[] = vRows.map((v) => ({
        id: v.id,
        productId: v.productId,
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        stock: v.stock,
        price: v.price ? Number(v.price) : undefined,
        imageUrl: v.imageUrl ?? undefined,
        createdAt: v.createdAt?.toISOString(),
        updatedAt: v.updatedAt?.toISOString(),
      }));

      if (variants.length === 0 && r.sizes && r.colors) {
        variants = buildProductVariants(
          r.id,
          r.sku || `SKU-${r.id}`,
          r.sizes as string[],
          r.colors as { name: string; hex: string; imageUrl?: string }[],
          r.salePrice ? Number(r.salePrice) : Number(r.price)
        );
      }

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        fabricDetails: r.fabricDetails ?? undefined,
        price: Number(r.price),
        salePrice: r.salePrice ? Number(r.salePrice) : undefined,
        stock: r.stock,
        categoryId: r.categoryId ?? 1,
        categoryName: r.categoryName ?? undefined,
        categorySlug: r.categorySlug ?? undefined,
        sizes: (r.sizes as string[]) || ["S", "M", "L", "XL", "2XL"],
        colors: (r.colors as { name: string; hex: string }[]) || [],
        images: mapImages(r.images),
        isFeatured: r.isFeatured ?? false,
        isNew: r.isNew ?? false,
        sku: r.sku ?? undefined,
        hasSizeGuide: r.hasSizeGuide !== null && r.hasSizeGuide !== undefined
          ? Boolean(r.hasSizeGuide)
          : (Array.isArray(r.sizes) && (r.sizes as string[]).some((s) => ["S", "M", "L", "XL", "2XL", "3XL"].includes(String(s).trim().toUpperCase()))),
        badgeText: r.badgeText || undefined,
        variants,
        createdAt: r.createdAt?.toISOString(),
      };
    });
  }

  async getRelated(categoryId: number, currentProductId: number, limit = 4): Promise<ProductItem[]> {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        fabricDetails: products.fabricDetails,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        sizes: products.sizes,
        colors: products.colors,
        images: products.images,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        sku: products.sku,
        hasSizeGuide: products.hasSizeGuide,
        badgeText: products.badgeText,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.categoryId, categoryId), ne(products.id, currentProductId)))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      fabricDetails: r.fabricDetails ?? undefined,
      price: Number(r.price),
      salePrice: r.salePrice ? Number(r.salePrice) : undefined,
      stock: r.stock,
      categoryId: r.categoryId ?? 1,
      categoryName: r.categoryName ?? undefined,
      categorySlug: r.categorySlug ?? undefined,
      sizes: (r.sizes as string[]) || ["S", "M", "L", "XL", "2XL"],
      colors: (r.colors as { name: string; hex: string }[]) || [],
      images: mapImages(r.images),
      isFeatured: r.isFeatured ?? false,
      isNew: r.isNew ?? false,
      sku: r.sku ?? undefined,
      hasSizeGuide: r.hasSizeGuide !== null && r.hasSizeGuide !== undefined
        ? Boolean(r.hasSizeGuide)
        : (Array.isArray(r.sizes) && (r.sizes as string[]).some((s) => ["S", "M", "L", "XL", "2XL", "3XL"].includes(String(s).trim().toUpperCase()))),
      badgeText: r.badgeText || undefined,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }));
  }

  async getLowStock(threshold = 5, limit = 10): Promise<ProductItem[]> {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        fabricDetails: products.fabricDetails,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        sizes: products.sizes,
        colors: products.colors,
        images: products.images,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        sku: products.sku,
        hasSizeGuide: products.hasSizeGuide,
        badgeText: products.badgeText,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(lte(products.stock, threshold))
      .orderBy(asc(products.stock))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      fabricDetails: r.fabricDetails ?? undefined,
      price: Number(r.price),
      salePrice: r.salePrice ? Number(r.salePrice) : undefined,
      stock: r.stock,
      categoryId: r.categoryId ?? 1,
      categoryName: r.categoryName ?? undefined,
      categorySlug: r.categorySlug ?? undefined,
      sizes: (r.sizes as string[]) || ["S", "M", "L", "XL", "2XL"],
      colors: (r.colors as { name: string; hex: string }[]) || [],
      images: mapImages(r.images),
      isFeatured: r.isFeatured ?? false,
      isNew: r.isNew ?? false,
      sku: r.sku ?? undefined,
      hasSizeGuide: r.hasSizeGuide !== null && r.hasSizeGuide !== undefined
        ? Boolean(r.hasSizeGuide)
        : (Array.isArray(r.sizes) && (r.sizes as string[]).some((s) => ["S", "M", "L", "XL", "2XL", "3XL"].includes(String(s).trim().toUpperCase()))),
      badgeText: r.badgeText || undefined,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }));
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
    const slug = data.slug || `prod-${Date.now().toString(36)}`;

    return await (dbPool || db).transaction(async (tx) => {
      const [inserted] = await tx
        .insert(products)
        .values({
          name: data.name,
          slug,
          description: data.description,
          fabricDetails: data.fabricDetails,
          price: String(data.price),
          salePrice: data.salePrice ? String(data.salePrice) : null,
          stock: totalStock,
          categoryId: data.categoryId,
          sizes: data.sizes,
          colors: data.colors,
          images: data.images,
          isFeatured: data.isFeatured ?? false,
          isNew: data.isNew ?? true,
          sku: cleanSku,
          hasSizeGuide: data.hasSizeGuide !== undefined ? data.hasSizeGuide : true,
          badgeText: data.badgeText && data.badgeText.trim() ? data.badgeText.trim() : null,
        })
        .returning();

      let savedVariants: ProductVariantItem[] = [];
      if (initialVariants.length > 0) {
        const now = Date.now().toString(36);
        const variantPayloads = initialVariants.map((v, idx) => ({
          productId: inserted.id,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex || "#000000",
          sku: v.sku?.trim() || `${cleanSku || "SKU"}-${v.size}-${v.colorName.replace(/\s+/g, "")}-${now}-${idx}`,
          stock: v.stock || 0,
          price: v.price ? String(v.price) : null,
          imageUrl: v.imageUrl || null,
        }));

        const insertedVariants = await tx
          .insert(productVariants)
          .values(variantPayloads)
          .returning();

        savedVariants = insertedVariants.map((iv) => ({
          id: iv.id,
          productId: iv.productId,
          size: iv.size,
          colorName: iv.colorName,
          colorHex: iv.colorHex,
          sku: iv.sku,
          stock: iv.stock,
          price: iv.price ? Number(iv.price) : undefined,
          imageUrl: iv.imageUrl ?? undefined,
        }));
      }

      return {
        ...data,
        id: inserted.id,
        slug: inserted.slug,
        sku: inserted.sku ?? undefined,
        hasSizeGuide: inserted.hasSizeGuide ?? true,
        badgeText: inserted.badgeText ?? undefined,
        stock: totalStock,
        variants: savedVariants,
        createdAt: inserted.createdAt.toISOString(),
        updatedAt: inserted.updatedAt?.toISOString(),
      };
    });
  }

  async update(id: number, data: Partial<ProductItem>): Promise<ProductItem | null> {
    const hasNewVariants = data.variants !== undefined && Array.isArray(data.variants);
    const computedStock = hasNewVariants
      ? data.variants!.reduce((sum, v) => sum + (v.stock || 0), 0)
      : data.stock;

    return await (dbPool || db).transaction(async (tx) => {
      const [updated] = await tx
        .update(products)
        .set({
          name: data.name,
          slug: data.slug,
          description: data.description,
          fabricDetails: data.fabricDetails !== undefined ? (data.fabricDetails?.trim() || null) : undefined,
          price: data.price !== undefined ? String(data.price) : undefined,
          salePrice: data.salePrice !== undefined ? (data.salePrice ? String(data.salePrice) : null) : undefined,
          stock: computedStock !== undefined ? computedStock : undefined,
          categoryId: data.categoryId,
          sizes: data.sizes,
          colors: data.colors,
          images: data.images,
          isFeatured: data.isFeatured,
          isNew: data.isNew,
          sku: data.sku !== undefined ? (data.sku && data.sku.trim() ? data.sku.trim() : null) : undefined,
          hasSizeGuide: data.hasSizeGuide !== undefined ? data.hasSizeGuide : undefined,
          badgeText: data.badgeText !== undefined ? (data.badgeText && data.badgeText.trim() ? data.badgeText.trim() : null) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      if (!updated) return null;

      let savedVariants: ProductVariantItem[] | undefined = undefined;
      if (hasNewVariants) {
        const existing = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, id));

        const existingMap = new Map<string, typeof existing[0]>();
        for (const ev of existing) {
          existingMap.set(ev.sku, ev);
          existingMap.set(`${ev.size.trim().toUpperCase()}:::${ev.colorName.trim()}`, ev);
        }

        savedVariants = [];
        const keptIds = new Set<number>();
        const toInsertPayloads: Array<{
          productId: number;
          size: string;
          colorName: string;
          colorHex: string;
          sku: string;
          stock: number;
          price: string | null;
          imageUrl: string | null;
        }> = [];

        const now = Date.now().toString(36);
        for (const [idx, v] of data.variants!.entries()) {
          const cleanVarSku = v.sku?.trim() || `${updated.sku || "SKU"}-${v.size}-${v.colorName.replace(/\s+/g, "")}-${now}-${idx}`;
          const key = `${v.size.trim().toUpperCase()}:::${v.colorName.trim()}`;
          const match = (v.id ? existing.find((ev) => ev.id === v.id) : undefined) || existingMap.get(cleanVarSku) || existingMap.get(key);

          if (match) {
            keptIds.add(match.id);
            const [updatedVar] = await tx
              .update(productVariants)
              .set({
                sku: cleanVarSku,
                stock: v.stock || 0,
                price: v.price ? String(v.price) : null,
                imageUrl: v.imageUrl || null,
                colorHex: v.colorHex || match.colorHex,
                updatedAt: new Date(),
              })
              .where(eq(productVariants.id, match.id))
              .returning();

            savedVariants.push({
              id: updatedVar.id,
              productId: updatedVar.productId,
              size: updatedVar.size,
              colorName: updatedVar.colorName,
              colorHex: updatedVar.colorHex,
              sku: updatedVar.sku,
              stock: updatedVar.stock,
              price: updatedVar.price ? Number(updatedVar.price) : undefined,
              imageUrl: updatedVar.imageUrl ?? undefined,
            });
          } else {
            toInsertPayloads.push({
              productId: id,
              size: v.size,
              colorName: v.colorName,
              colorHex: v.colorHex || "#000000",
              sku: cleanVarSku,
              stock: v.stock || 0,
              price: v.price ? String(v.price) : null,
              imageUrl: v.imageUrl || null,
            });
          }
        }

        if (toInsertPayloads.length > 0) {
          const newlyInserted = await tx
            .insert(productVariants)
            .values(toInsertPayloads)
            .returning();

          for (const vRow of newlyInserted) {
            keptIds.add(vRow.id);
            savedVariants.push({
              id: vRow.id,
              productId: vRow.productId,
              size: vRow.size,
              colorName: vRow.colorName,
              colorHex: vRow.colorHex,
              sku: vRow.sku,
              stock: vRow.stock,
              price: vRow.price ? Number(vRow.price) : undefined,
              imageUrl: vRow.imageUrl ?? undefined,
            });
          }
        }

        const toDelete = existing.filter((ev) => !keptIds.has(ev.id));
        if (toDelete.length > 0) {
          await tx
            .delete(productVariants)
            .where(inArray(productVariants.id, toDelete.map((d) => d.id)));
        }
      }

      return {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        fabricDetails: updated.fabricDetails ?? undefined,
        price: Number(updated.price),
        salePrice: updated.salePrice ? Number(updated.salePrice) : undefined,
        stock: updated.stock,
        categoryId: updated.categoryId ?? 1,
        sizes: (updated.sizes as string[]) || [],
        colors: (updated.colors as { name: string; hex: string }[]) || [],
        images: mapImages(updated.images),
        isFeatured: updated.isFeatured ?? false,
        isNew: updated.isNew ?? false,
        sku: updated.sku ?? undefined,
        hasSizeGuide: updated.hasSizeGuide !== null && updated.hasSizeGuide !== undefined
          ? Boolean(updated.hasSizeGuide)
          : (Array.isArray(updated.sizes) && (updated.sizes as string[]).some((s) => ["S", "M", "L", "XL", "2XL", "3XL"].includes(String(s).trim().toUpperCase()))),
        badgeText: updated.badgeText || undefined,
        variants: savedVariants,
        createdAt: updated.createdAt?.toISOString(),
        updatedAt: updated.updatedAt?.toISOString(),
      };
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(products).where(eq(products.id, id)).returning();
    return deleted.length > 0;
  }
}
