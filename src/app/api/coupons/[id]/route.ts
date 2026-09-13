import { NextResponse } from "next/server";
import { updateCoupon, toggleCouponStatus, deleteCoupon, getCouponById } from "@/lib/data-service";
import { updateCouponSchema } from "@/lib/validations";
import { withAdminAuth } from "@/lib/api-handler";

export const GET = withAdminAuth(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const coupon = await getCouponById(id);
    if (!coupon) {
      return NextResponse.json({ error: "الكوبون غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(coupon);
  },
  "فشل في جلب الكوبون"
);

export const PATCH = withAdminAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "معرّف الكوبون غير صالح", code: "INVALID_ID" }, { status: 400 });
    }

    const rawBody = await request.json();

    if (rawBody.isActive !== undefined && Object.keys(rawBody).length === 1) {
      await toggleCouponStatus(numId, Boolean(rawBody.isActive));
      return NextResponse.json({ success: true, isActive: rawBody.isActive });
    }

    const validated = updateCouponSchema.parse(rawBody);

    const existing = await getCouponById(numId);
    if (!existing) {
      return NextResponse.json({ error: "الكوبون غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }

    const effectiveType = validated.discountType || existing.discountType;
    const effectiveValue = validated.discountValue !== undefined ? validated.discountValue : existing.discountValue;

    if (effectiveType === "percentage" && effectiveValue > 100) {
      return NextResponse.json({ error: "نسبة الخصم المئوية لا يمكن أن تتجاوز 100%", code: "INVALID_PERCENTAGE" }, { status: 400 });
    }

    const updated = await updateCoupon(numId, {
      ...validated,
      usageLimit: validated.usageLimit ?? undefined,
      expiresAt: validated.expiresAt || undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "الكوبون غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(updated);
  },
  "فشل في تعديل الكوبون"
);

// Support both PUT and PATCH for update operations
export const PUT = PATCH;

export const DELETE = withAdminAuth(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "معرّف الكوبون غير صالح", code: "INVALID_ID" }, { status: 400 });
    }

    const deleted = await deleteCoupon(numId);
    if (!deleted) {
      return NextResponse.json({ error: "الكوبون غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  },
  "فشل في حذف الكوبون"
);
