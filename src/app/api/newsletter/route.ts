import { NextResponse } from "next/server";
import { getNewsletterSubscribers, subscribeNewsletter } from "@/lib/data-service";
import { requireAdminApi } from "@/lib/auth-guard";
import { z } from "zod";

import { newsletterSchema } from "@/lib/validations";
import { rateLimitGuard } from "@/lib/rate-limiter";

export async function GET(request: Request) {
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  try {
    const subscribers = await getNewsletterSubscribers();
    return NextResponse.json(subscribers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "فشل في جلب المشتركين";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimitError = await rateLimitGuard(request, "newsletter", { maxRequests: 5, windowSeconds: 60 });
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validated.contact);
    const type: "email" | "phone" = isEmail ? "email" : "phone";

    const result = await subscribeNewsletter(validated.contact, type);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "بيانات غير صالحة" },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "فشل في تسجيل الاشتراك";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
