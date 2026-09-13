"use server";

import { headers } from "next/headers";
import { subscribeNewsletter } from "@/lib/data-service";
import { newsletterSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";


export interface NewsletterState {
  success: boolean;
  message: string;
  error?: string;
}

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  // Rate limit: 5 subscriptions per minute per IP
  const headersList = await headers();
  const ip = headersList.get("x-real-ip")?.trim()
    || headersList.get("x-forwarded-for")?.split(",").pop()?.trim()
    || "127.0.0.1";
  const rateLimitResult = await checkRateLimit(`newsletter:${ip}`, {
    maxRequests: 5,
    windowSeconds: 60,
  });

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      message: "",
      error: "تم تجاوز الحد المسموح من المحاولات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.",
    };
  }

  const contact = formData.get("contact") as string;

  const validation = newsletterSchema.safeParse({ contact });

  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || "بيانات غير صالحة";
    return {
      success: false,
      message: "",
      error: errorMsg,
    };
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validation.data.contact);
  const type: "email" | "phone" = isEmail ? "email" : "phone";

  const result = await subscribeNewsletter(validation.data.contact, type);

  return {
    success: result.success,
    message: result.message,
  };
}
