import { z } from "zod";
import { normalizeEgyptianPhone, isValidEgyptianPhone } from "@/lib/egypt-constants";

export const newsletterSchema = z.object({
  contact: z
    .string()
    .trim()
    .min(3, "البيانات المدخلة قصيرة جداً")
    .transform((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (isEmail) return val.toLowerCase();
      return normalizeEgyptianPhone(val);
    })
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isEgyPhone = isValidEgyptianPhone(val);
        return isEmail || isEgyPhone;
      },
      {
        message: "يرجى إدخال بريد إلكتروني صالح أو رقم هاتف مصري يبدأ بـ 010 أو 011 أو 012 أو 015",
      }
    ),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
