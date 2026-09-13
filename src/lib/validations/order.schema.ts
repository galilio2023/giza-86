import { z } from "zod";
import { normalizeEgyptianPhone, isValidEgyptianPhone, EGYPTIAN_GOVERNORATES } from "@/lib/egypt-constants";

const VALID_GOVERNORATE_NAMES = EGYPTIAN_GOVERNORATES.map((g) => g.name);
const VALID_GOVERNORATE_IDS = EGYPTIAN_GOVERNORATES.map((g) => g.id);

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "يرجى إدخال اسم العميل بالكامل")
    .max(150, "اسم العميل يجب ألا يتجاوز 150 حرفاً"),
  customerPhone: z
    .string()
    .trim()
    .transform((val) => normalizeEgyptianPhone(val))
    .refine((val) => isValidEgyptianPhone(val), "يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)"),
  alternatePhone: z
    .string()
    .trim()
    .transform((val) => (val ? normalizeEgyptianPhone(val) : ""))
    .refine((val) => !val || isValidEgyptianPhone(val), "يرجى إدخال رقم هاتف بديل صحيح")
    .optional()
    .nullable()
    .or(z.literal("")),
  governorate: z
    .string()
    .trim()
    .min(2, "يرجى اختيار المحافظة")
    .max(50, "اسم المحافظة غير صالح")
    .refine(
      (val) => VALID_GOVERNORATE_NAMES.includes(val) || VALID_GOVERNORATE_IDS.includes(val.toLowerCase()),
      "المحافظة المدخلة غير صالحة. يرجى اختيار محافظة مصرية من القائمة."
    ),
  city: z
    .string()
    .trim()
    .min(2, "يرجى كتابة اسم المدينة أو المنطقة")
    .max(100, "اسم المدينة يجب ألا يتجاوز 100 حرف"),
  address: z
    .string()
    .trim()
    .min(5, "يرجى إدخال عنوان تفصيلي واضح (10 أحرف على الأقل)")
    .max(1000, "العنوان طويل جداً (الحد الأقصى 1000 حرف)"),
  notes: z.string().trim().max(500, "الملاحظات يجب ألا تتجاوز 500 حرف").optional().nullable(),
  paymentMethod: z.enum(["cod", "instapay", "vodafone_cash", "card"]),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive("معرّف المنتج غير صالح"),
        variantId: z.number().int().positive().optional().nullable(),
        name: z.string().max(255),
        size: z.string().max(50),
        color: z.string().max(50),
        quantity: z.number().int().min(1, "الكمية يجب أن تكون 1 على الأقل").max(99, "الكمية القصوى لكل منتج هي 99 قطعة"),
        image: z.string().optional().nullable(),
      })
    )
    .min(1, "يجب أن تحتوي السلة على منتج واحد على الأقل")
    .max(50, "لا يمكن تقديم طلب يحتوي على أكثر من 50 صنف في الطلب الواحد"),
  couponCode: z.string().trim().max(50).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Shared Client/Server Zod schema for checkout address and contact inputs.
 * Ensures identical validation rules across UI forms and backend handlers.
 */
export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "يرجى إدخال الاسم بالكامل (الاسم الثنائي أو الثلاثي على الأقل)")
    .refine((val) => val.split(/\s+/).filter(Boolean).length >= 2, {
      message: "يرجى إدخال الاسم بالكامل (الاسم الثنائي أو الثلاثي على الأقل)",
    })
    .max(150, "اسم العميل يجب ألا يتجاوز 150 حرفاً"),
  phone: z
    .string()
    .trim()
    .refine((val) => isValidEgyptianPhone(val), {
      message: "يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)",
    }),
  alternatePhone: z
    .string()
    .trim()
    .refine((val) => !val || isValidEgyptianPhone(val), {
      message: "يرجى إدخال رقم هاتف بديل مصري صحيح",
    })
    .optional()
    .or(z.literal("")),
  governorate: z.string().trim().min(2, "يرجى اختيار المحافظة").refine(
    (val) => VALID_GOVERNORATE_NAMES.includes(val) || VALID_GOVERNORATE_IDS.includes(val.toLowerCase()),
    "المحافظة المدخلة غير صالحة. يرجى اختيار محافظة مصرية من القائمة."
  ),
  city: z.string().trim().min(2, "يرجى كتابة اسم المنطقة أو المدينة أو المركز"),
  address: z
    .string()
    .trim()
    .min(10, "يرجى كتابة العنوان بالتفصيل (اسم الشارع، رقم العقار، علامة مميزة - 10 أحرف كحد أدنى)")
    .max(1000, "العنوان طويل جداً (الحد الأقصى 1000 حرف)"),
  vodafoneSenderPhone: z
    .string()
    .trim()
    .refine((val) => !val || isValidEgyptianPhone(val), {
      message: "رقم محفظة فودافون كاش غير صحيح (11 رقماً تبدأ بـ 010)",
    })
    .optional()
    .or(z.literal("")),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
