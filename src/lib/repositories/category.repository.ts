import { CategoryItem } from "@/types";
import { isDatabaseConfigured, db, dbPool } from "@/db";
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

/**
 * Checks whether a proposed parent ID is a descendant of the target category to prevent cycles.
 * @param proposedParentId Candidate parent category ID.
 * @param targetId Target category ID being updated.
 * @param allCategories Flat list of all categories with parent relationships.
 * @returns True if proposedParentId is a descendant of targetId, otherwise false.
 */
function isDescendant(
  proposedParentId: number,
  targetId: number,
  allCategories: { id: number; parentId?: number | null }[]
): boolean {
  if (proposedParentId === targetId) return true;
  let currentParentId: number | null | undefined = proposedParentId;
  const visited = new Set<number>();

  while (currentParentId) {
    if (visited.has(currentParentId)) break;
    visited.add(currentParentId);
    if (currentParentId === targetId) return true;
    const parentCat = allCategories.find((c) => c.id === currentParentId);
    currentParentId = parentCat?.parentId;
  }
  return false;
}

export class MemoryCategoryRepository implements ICategoryRepository {
  /**
   * Retrieves all categories sorted by displayOrder with parentName, children arrays, and rolled-up product counts.
   */
  async findMany(): Promise<CategoryItem[]> {
    const sorted = [...memoryCategories].sort((a, b) => {
      const orderA = a.displayOrder ?? 0;
      const orderB = b.displayOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    });

    const directCounts = new Map<number, number>();
    for (const c of sorted) {
      directCounts.set(
        c.id,
        memoryProducts.filter((p) => p.categoryId === c.id).length
      );
    }

    const catMap = new Map<number, CategoryItem>();
    for (const c of sorted) {
      catMap.set(c.id, { ...c });
    }

    // Assign parentName and children
    for (const c of sorted) {
      const item = catMap.get(c.id)!;
      if (c.parentId) {
        const parent = catMap.get(c.parentId);
        item.parentName = parent?.name || null;
      } else {
        item.parentName = null;
      }
    }

    // Build children arrays on parent categories
    for (const c of sorted) {
      if (c.parentId) {
        const parent = catMap.get(c.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(catMap.get(c.id)!);
        }
      }
    }

    // Calculate rolled-up productsCount (direct + all children counts)
    for (const c of sorted) {
      const item = catMap.get(c.id)!;
      let total = directCounts.get(c.id) || 0;
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          total += directCounts.get(child.id) || 0;
        }
      }
      item.productsCount = total;
    }

    return sorted.map((c) => catMap.get(c.id)!);
  }

  /**
   * Finds a category by numeric ID or slug.
   * @param identifier Numeric category ID or string slug.
   */
  async findById(identifier: number | string): Promise<CategoryItem | null> {
    const idNum = Number(identifier);
    const cat = !isNaN(idNum)
      ? memoryCategories.find((c) => c.id === idNum)
      : memoryCategories.find((c) => c.slug === identifier);
    if (!cat) return null;

    let parentName: string | null = null;
    if (cat.parentId) {
      const parent = memoryCategories.find((p) => p.id === cat.parentId);
      parentName = parent?.name || null;
    }

    const children = memoryCategories.filter((c) => c.parentId === cat.id);

    return {
      ...cat,
      parentName,
      children: children.length > 0 ? children : undefined,
    };
  }

  /**
   * Creates a new category in memory store.
   * @param data Category creation attributes.
   */
  async create(data: Omit<CategoryItem, "id" | "createdAt" | "updatedAt">): Promise<CategoryItem> {
    const now = new Date().toISOString();
    const newCat: CategoryItem = {
      ...data,
      id: Date.now(),
      displayOrder: data.displayOrder ?? 0,
      parentId: data.parentId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    memoryCategories.push(newCat);
    return newCat;
  }

  /**
   * Updates an existing category with cycle prevention and 2-tier hierarchy guards.
   * @param id Category ID to update.
   * @param data Partial category fields.
   */
  async update(id: number, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const idx = memoryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    if (data.displayOrder !== undefined && data.displayOrder !== memoryCategories[idx].displayOrder) {
      const oldOrder = memoryCategories[idx].displayOrder ?? 0;
      const collisionIdx = memoryCategories.findIndex(
        (c) => c.id !== id && c.displayOrder === data.displayOrder
      );
      if (collisionIdx !== -1) {
        memoryCategories[collisionIdx].displayOrder = oldOrder;
      }
    }

    // Prevent direct/indirect circular parenting and multi-tier nesting
    let safeParentId = data.parentId;
    if (data.parentId !== undefined && data.parentId !== null) {
      if (isDescendant(data.parentId, id, memoryCategories)) {
        safeParentId = null;
      }
      const hasChildren = memoryCategories.some((c) => c.parentId === id);
      if (hasChildren) {
        safeParentId = null;
      }
    }

    memoryCategories[idx] = {
      ...memoryCategories[idx],
      ...data,
      parentId: safeParentId !== undefined ? safeParentId : memoryCategories[idx].parentId,
      updatedAt: new Date().toISOString(),
    };
    return memoryCategories[idx];
  }

  /**
   * Deletes a category, reassigning orphan children to top-level and products to fallback category.
   * @param id Category ID to delete.
   */
  async delete(id: number): Promise<boolean> {
    const idx = memoryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    // Orphan handling: reset parentId for child categories
    for (let i = 0; i < memoryCategories.length; i++) {
      if (memoryCategories[i].parentId === id) {
        memoryCategories[i].parentId = null;
      }
    }

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
  /**
   * Retrieves all categories from Neon PostgreSQL with parentName, children arrays, and rolled-up product counts.
   */
  async findMany(): Promise<CategoryItem[]> {
    const parentCat = sql.raw('"parent_cat"');
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        description: categories.description,
        displayOrder: categories.displayOrder,
        parentId: categories.parentId,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        directProductsCount: sql<number>`count(${products.id})::int`,
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id)
      .orderBy(asc(categories.displayOrder), asc(categories.id));

    const directCounts = new Map<number, number>();
    const catMap = new Map<number, CategoryItem>();

    for (const r of rows) {
      directCounts.set(r.id, Number(r.directProductsCount || 0));
      catMap.set(r.id, {
        id: r.id,
        name: r.name,
        slug: r.slug,
        image: r.image,
        description: r.description ?? undefined,
        displayOrder: r.displayOrder ?? 0,
        parentId: r.parentId ?? null,
        parentName: null,
        children: undefined,
        productsCount: Number(r.directProductsCount || 0),
        createdAt: r.createdAt?.toISOString(),
        updatedAt: r.updatedAt?.toISOString(),
      });
    }

    // Set parent names
    for (const r of rows) {
      const item = catMap.get(r.id)!;
      if (r.parentId) {
        const parent = catMap.get(r.parentId);
        item.parentName = parent?.name || null;
      }
    }

    // Attach children arrays to parents
    for (const r of rows) {
      if (r.parentId) {
        const parent = catMap.get(r.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(catMap.get(r.id)!);
        }
      }
    }

    // Roll up product counts for parent categories (direct + all child categories)
    for (const r of rows) {
      const item = catMap.get(r.id)!;
      let total = directCounts.get(r.id) || 0;
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          total += directCounts.get(child.id) || 0;
        }
      }
      item.productsCount = total;
    }

    return rows.map((r) => catMap.get(r.id)!);
  }

  /**
   * Finds a category by numeric ID or slug in Neon PostgreSQL.
   * @param identifier Numeric category ID or string slug.
   */
  async findById(identifier: number | string): Promise<CategoryItem | null> {
    const idNum = Number(identifier);
    const condition = !isNaN(idNum) ? eq(categories.id, idNum) : eq(categories.slug, String(identifier));
    const rows = await db.select().from(categories).where(condition).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];

    let parentName: string | null = null;
    if (r.parentId) {
      const [parentRow] = await db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, r.parentId))
        .limit(1);
      parentName = parentRow?.name || null;
    }

    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      description: r.description ?? undefined,
      displayOrder: r.displayOrder ?? 0,
      parentId: r.parentId ?? null,
      parentName,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    };
  }

  /**
   * Creates a new category in Neon PostgreSQL.
   * @param data Category attributes.
   */
  async create(data: Omit<CategoryItem, "id" | "createdAt" | "updatedAt">): Promise<CategoryItem> {
    const [inserted] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        parentId: data.parentId ?? null,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      slug: inserted.slug,
      image: inserted.image,
      description: inserted.description ?? undefined,
      displayOrder: inserted.displayOrder ?? 0,
      parentId: inserted.parentId ?? null,
      createdAt: inserted.createdAt?.toISOString(),
      updatedAt: inserted.updatedAt?.toISOString(),
    };
  }

  /**
   * Updates an existing category in a PostgreSQL transaction with cycle prevention and order swapping.
   * @param id Category ID to update.
   * @param data Category updates.
   */
  async update(id: number, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const client = dbPool || db;
    return await client.transaction(async (tx) => {
      // Prevent direct/indirect circular parenting and multi-tier nesting
      let safeParentId = data.parentId;
      if (data.parentId !== undefined && data.parentId !== null) {
        if (data.parentId === id) {
          safeParentId = null;
        } else {
          const allCats = await tx
            .select({ id: categories.id, parentId: categories.parentId })
            .from(categories);

          const isCycle = isDescendant(data.parentId, id, allCats);
          const hasChildren = allCats.some((c) => c.parentId === id);

          if (isCycle || hasChildren) {
            safeParentId = null;
          }
        }
      }

      // If displayOrder is updated and conflicts with another category, swap them
      if (data.displayOrder !== undefined) {
        const [current] = await tx
          .select({ id: categories.id, displayOrder: categories.displayOrder })
          .from(categories)
          .where(eq(categories.id, id))
          .limit(1);

        if (current && current.displayOrder !== data.displayOrder) {
          const [targetOther] = await tx
            .select({ id: categories.id, displayOrder: categories.displayOrder })
            .from(categories)
            .where(sql`${categories.id} != ${id} AND ${categories.displayOrder} = ${data.displayOrder}`)
            .limit(1);

          if (targetOther) {
            const firstId = Math.min(id, targetOther.id);
            const secondId = Math.max(id, targetOther.id);
            await tx.select({ id: categories.id }).from(categories).where(eq(categories.id, firstId)).for("update");
            await tx.select({ id: categories.id }).from(categories).where(eq(categories.id, secondId)).for("update");

            await tx
              .update(categories)
              .set({ displayOrder: current.displayOrder, updatedAt: new Date() })
              .where(eq(categories.id, targetOther.id));
          }
        }
      }

      const updateValues: Record<string, unknown> = {
        updatedAt: new Date(),
      };
      if (data.name !== undefined) updateValues.name = data.name;
      if (data.slug !== undefined) updateValues.slug = data.slug;
      if (data.image !== undefined) updateValues.image = data.image;
      if (data.description !== undefined) updateValues.description = data.description;
      if (data.displayOrder !== undefined) updateValues.displayOrder = data.displayOrder;
      if (data.parentId !== undefined) updateValues.parentId = safeParentId ?? null;

      const [updated] = await tx
        .update(categories)
        .set(updateValues)
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
        parentId: updated.parentId ?? null,
        createdAt: updated.createdAt?.toISOString(),
        updatedAt: updated.updatedAt?.toISOString(),
      };
    });
  }

  /**
   * Deletes a category safely by unlinking children (setting parentId = null) and reassigning products.
   * @param id Category ID to delete.
   */
  async delete(id: number): Promise<boolean> {
    // Reset child categories parentId to null
    await db.update(categories).set({ parentId: null }).where(eq(categories.parentId, id));

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

/**
 * Returns the singleton category repository instance (Drizzle or Memory store fallback).
 */
export function getCategoryRepository(): ICategoryRepository {
  if (!repositoryInstance) {
    repositoryInstance =
      isDatabaseConfigured && db
        ? new DrizzleCategoryRepository()
        : new MemoryCategoryRepository();
  }
  return repositoryInstance;
}
