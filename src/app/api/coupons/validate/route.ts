import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/data-service";
import { rateLimitGuard } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  const rateLimitError = await rateLimitGuard(request, "coupon-validate", { maxRequests: 15, windowSeconds: 60 });
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string" || !code.trim() || code.trim().length > 50) {
      return NextResponse.json(
        { valid: false, discount: 0, message: "كود الكوبون المدخل غير صالح" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanSubtotal = Math.min(10_000_000, Math.max(0, Number(subtotal) || 0));

    const res = await validateCoupon(cleanCode, cleanSubtotal);
    return NextResponse.json(res);
  } catch (error: unknown) {
    console.error("Coupon validation error:", error);
    const message = error instanceof Error ? error.message : "فشل التحقق من الكوبون";
    return NextResponse.json(
      { valid: false, discount: 0, message },
      { status: 500 }
    );
  }
}
