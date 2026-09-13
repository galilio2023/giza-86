import { CategoryItem } from "@/types";
import { isDatabaseConfigured, db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, asc, sql, ne } from "drizzle-orm";
import { memoryCategories, memoryProducts } from "./memory-store";

export interface ICategoryRepository {
  findMany(): Promise<CategoryItem[]>;
  findById(id: number | string): Promise<CategoryItem | null>;
  create(data: Omit<CategoryItem, "id" | "createdAt" | "updatedAt">): Promise<CategoryItem>;
  update(id: number, data: Partial<CategoryItem>): Promise<CategoryItem | null>;
  delete(id: number): Promise<boolean>;
}

export class MemoryCategoryRepository implements ICategoryRepository {
  async findMany(): Promise<CategoryItem[]> {
    return memoryCategories.map((c) => ({
      ...c,
      productsCount: memoryProducts.filter((p) => p.categoryId === c.id).length,
    }));
  }

  async findById(identifier: number | string): Promise<CategoryItem | null> {
    const idNum = Number(identifier);
    if (!isNaN(idNum)) {
      return memoryCategories.find((c) => c.id === idNum) || null;
    }
    return memoryCategories.find((c) => c.slug === identifier) || null;
  }

  async create(data: Omit<CategoryItem, "id" | "createdAt" | "updatedAt">): Promise<CategoryItem> {
    const now = new Date().toISOString();
    const newCat: CategoryItem = {
      ...data,
      id: Date.now(),
      displayOrder: data.displayOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    memoryCategories.push(newCat);
    return newCat;
  }

  async update(id: number, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const idx = memoryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    memoryCategories[idx] = {
      ...memoryCategories[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return memoryCategories[idx];
  }

  async delete(id: number): Promise<boolean> {
    const idx = memoryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    memoryCategories.splice(idx, 1);
    const fallbackCatId = memoryCategories.length > 0 ? memoryCategories[0].id : 1;
    for (let i = 0; i < memoryProducts.length; i++) {
      if (memoryProducts[i].categoryId === id) {
        memoryProducts[i] = { ...memoryProducts[i], categoryId: fallbackCatId };
      }
    }
    return true;
  }
}

export class DrizzleCategoryRepository implements ICategoryRepository {
  async findMany(): Promise<CategoryItem[]> {
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        description: categories.description,
        displayOrder: categories.displayOrder,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productsCount: sql<number>`count(${products.id})::int`,
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id)
      .orderBy(asc(categories.displayOrder));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      description: r.description ?? undefined,
      displayOrder: r.displayOrder ?? 0,
      productsCount: Number(r.productsCount || 0),
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }));
  }

  async findById(identifier: number | string): Promise<CategoryItem | null> {
    const idNum = Number(identifier);
    const condition = !isNaN(idNum) ? eq(categories.id, idNum) : eq(categories.slug, String(identifier));
    const rows = await db.select().from(categories).where(condition).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      description: r.description ?? undefined,
      displayOrder: r.displayOrder ?? 0,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    };
  }

  async create(data: Omit<CategoryItem, "id" | "createdAt" | "updatedAt">): Promise<CategoryItem> {
    const [inserted] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      slug: inserted.slug,
      image: inserted.image,
      description: inserted.description ?? undefined,
      displayOrder: inserted.displayOrder ?? 0,
      createdAt: inserted.createdAt?.toISOString(),
      updatedAt: inserted.updatedAt?.toISOString(),
    };
  }

  async update(id: number, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const [updated] = await db
      .update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        displayOrder: data.displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      image: updated.image,
      description: updated.description ?? undefined,
      displayOrder: updated.displayOrder ?? 0,
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };
  }

  async delete(id: number): Promise<boolean> {
    const fallbackCat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(ne(categories.id, id))
      .limit(1);

    const fallbackCatId = fallbackCat.length > 0 ? fallbackCat[0].id : null;
    await db.update(products).set({ categoryId: fallbackCatId }).where(eq(products.categoryId, id));
    const deleted = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    return deleted.length > 0;
  }
}

let repositoryInstance: ICategoryRepository | null = null;

export function getCategoryRepository(): ICategoryRepository {
  if (!repositoryInstance) {
    repositoryInstance =
      isDatabaseConfigured && db
        ? new DrizzleCategoryRepository()
        : new MemoryCategoryRepository();
  }
  return repositoryInstance;
}
