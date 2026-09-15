import { CouponItem } from "@/types";
import { isDatabaseConfigured, db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { memoryCoupons } from "./memory-store";

export interface ICouponRepository {
  findMany(): Promise<CouponItem[]>;
  findById(identifier: string | number): Promise<CouponItem | null>;
  create(data: Omit<CouponItem, "id">): Promise<CouponItem>;
  update(id: number, data: Partial<CouponItem>): Promise<CouponItem | null>;
  delete(id: number): Promise<boolean>;
}

export class MemoryCouponRepository implements ICouponRepository {
  async findMany(): Promise<CouponItem[]> {
    return memoryCoupons;
  }

  async findById(identifier: string | number): Promise<CouponItem | null> {
    const idNum = Number(identifier);
    if (!isNaN(idNum)) {
      return memoryCoupons.find((c) => c.id === idNum) || null;
    }
    return memoryCoupons.find((c) => c.code.toUpperCase() === String(identifier).trim().toUpperCase()) || null;
  }

  async create(data: Omit<CouponItem, "id">): Promise<CouponItem> {
    const cleanCode = data.code.trim().toUpperCase();
    const now = new Date().toISOString();
    const newCoup: CouponItem = {
      ...data,
      id: Date.now(),
      code: cleanCode,
      usedCount: 0,
      isActive: data.isActive ?? true,
      expiresAt: data.expiresAt || undefined,
      createdAt: now,
      updatedAt: now,
    };
    memoryCoupons.unshift(newCoup);
    return newCoup;
  }

  async update(id: number, data: Partial<CouponItem>): Promise<CouponItem | null> {
    const idx = memoryCoupons.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    memoryCoupons[idx] = {
      ...memoryCoupons[idx],
      ...data,
      code: data.code ? data.code.trim().toUpperCase() : memoryCoupons[idx].code,
      updatedAt: new Date().toISOString(),
    };
    return memoryCoupons[idx];
  }

  async delete(id: number): Promise<boolean> {
    const idx = memoryCoupons.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    memoryCoupons.splice(idx, 1);
    return true;
  }
}

export class DrizzleCouponRepository implements ICouponRepository {
  async findMany(): Promise<CouponItem[]> {
    const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      discountType: r.discountType as CouponItem["discountType"],
      discountValue: Number(r.discountValue),
      minOrderValue: Number(r.minOrderValue || 0),
      usageLimit: r.usageLimit ?? undefined,
      usedCount: r.usedCount ?? 0,
      isActive: r.isActive ?? true,
      expiresAt: r.expiresAt?.toISOString(),
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }));
  }

  async findById(identifier: string | number): Promise<CouponItem | null> {
    const idNum = Number(identifier);
    const condition = !isNaN(idNum)
      ? eq(coupons.id, idNum)
      : eq(coupons.code, String(identifier).trim().toUpperCase());

    const rows = await db.select().from(coupons).where(condition).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      code: r.code,
      discountType: r.discountType as CouponItem["discountType"],
      discountValue: Number(r.discountValue),
      minOrderValue: Number(r.minOrderValue || 0),
      usageLimit: r.usageLimit ?? undefined,
      usedCount: r.usedCount ?? 0,
      isActive: r.isActive ?? true,
      expiresAt: r.expiresAt?.toISOString(),
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    };
  }

  async create(data: Omit<CouponItem, "id">): Promise<CouponItem> {
    const cleanCode = data.code.trim().toUpperCase();
    const [inserted] = await db
      .insert(coupons)
      .values({
        code: cleanCode,
        discountType: data.discountType,
        discountValue: String(data.discountValue),
        minOrderValue: String(data.minOrderValue || 0),
        usageLimit: data.usageLimit ?? null,
        usedCount: 0,
        isActive: data.isActive ?? true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      })
      .returning();

    return {
      id: inserted.id,
      code: inserted.code,
      discountType: inserted.discountType as CouponItem["discountType"],
      discountValue: Number(inserted.discountValue),
      minOrderValue: Number(inserted.minOrderValue || 0),
      usageLimit: inserted.usageLimit ?? undefined,
      usedCount: inserted.usedCount ?? 0,
      isActive: inserted.isActive ?? true,
      expiresAt: inserted.expiresAt?.toISOString(),
      createdAt: inserted.createdAt?.toISOString(),
      updatedAt: inserted.updatedAt?.toISOString(),
    };
  }

  async update(id: number, data: Partial<CouponItem>): Promise<CouponItem | null> {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (data.code !== undefined) updateData.code = data.code.trim().toUpperCase();
    if (data.discountType !== undefined) updateData.discountType = data.discountType;
    if (data.discountValue !== undefined) updateData.discountValue = String(data.discountValue);
    if (data.minOrderValue !== undefined) updateData.minOrderValue = String(data.minOrderValue);
    if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    const [updated] = await db
      .update(coupons)
      .set(updateData)
      .where(eq(coupons.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      code: updated.code,
      discountType: updated.discountType as CouponItem["discountType"],
      discountValue: Number(updated.discountValue),
      minOrderValue: Number(updated.minOrderValue || 0),
      usageLimit: updated.usageLimit ?? undefined,
      usedCount: updated.usedCount ?? 0,
      isActive: updated.isActive ?? true,
      expiresAt: updated.expiresAt?.toISOString(),
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(coupons).where(eq(coupons.id, id)).returning({ id: coupons.id });
    return deleted.length > 0;
  }
}

let couponRepositoryInstance: ICouponRepository | null = null;

/** Returns the singleton coupon repository instance (Drizzle or Memory fallback). */
export function getCouponRepository(): ICouponRepository {
  if (!couponRepositoryInstance) {
    couponRepositoryInstance =
      isDatabaseConfigured && db
        ? new DrizzleCouponRepository()
        : new MemoryCouponRepository();
  }
  return couponRepositoryInstance;
}
