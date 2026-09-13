import { NextResponse } from "next/server";
import { getCoupons, createCoupon } from "@/lib/data-service";
import { withAdminAuth } from "@/lib/api-handler";
import { createCouponSchema } from "@/lib/validations";

export const GET = withAdminAuth(async () => {
  const list = await getCoupons();
  return NextResponse.json(list);
}, "فشل في جلب الكوبونات");

export const POST = withAdminAuth(async (request: Request) => {
  const rawBody = await request.json();
  const validated = createCouponSchema.parse(rawBody);

  const created = await createCoupon({
    code: validated.code.trim().toUpperCase(),
    discountType: validated.discountType,
    discountValue: validated.discountValue,
    minOrderValue: validated.minOrderValue,
    usageLimit: validated.usageLimit ?? undefined,
    isActive: validated.isActive,
    expiresAt: validated.expiresAt || undefined,
  });

  return NextResponse.json(created, { status: 201 });
}, "فشل في إنشاء الكوبون");

