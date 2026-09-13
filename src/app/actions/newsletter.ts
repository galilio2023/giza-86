"use server";

import { subscribeNewsletter } from "@/lib/data-service";
import { newsletterSchema } from "@/lib/validations";


export interface NewsletterState {
  success: boolean;
  message: string;
  error?: string;
}

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
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
