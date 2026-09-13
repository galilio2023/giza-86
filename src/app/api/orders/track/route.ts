import { NextResponse } from "next/server";
import { trackOrder } from "@/lib/data-service";
import { isValidEgyptianPhone } from "@/lib/egypt-constants";
import { rateLimitGuard } from "@/lib/rate-limiter";
import { z } from "zod";

const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(3, "يرجى كتابة رقم الطلب بالكامل").max(50),
  phone: z
    .string()
    .trim()
    .min(10, "يرجى إدخال رقم هاتف صحيح")
    .refine((val) => isValidEgyptianPhone(val), "يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)"),
});

export async function POST(request: Request) {
  const rateLimitError = await rateLimitGuard(request, "track-order", { maxRequests: 20, windowSeconds: 60 });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await request.json();
    const validated = trackOrderSchema.parse(rawBody);

    const order = await trackOrder(validated.orderNumber, validated.phone);

    if (!order) {
      return NextResponse.json(
        {
          error: "لم يتم العثور على طلب يطابق هذا الرقم ورقم الهاتف المدخلين. يرجى التأكد من البيانات والمحاولة مرة أخرى.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "بيانات الاستعلام غير صالحة" },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "فشل في تتبع الطلب";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
