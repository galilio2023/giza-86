import { z } from "zod";

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "كود الكوبون يجب أن يحتوي على حرفين على الأقل")
      .max(50, "كود الكوبون يجب ألا يتجاوز 50 حرفاً")
      .regex(/^[A-Za-z0-9_-]+$/, "كود الكوبون يجب أن يحتوي على أحرف وأرقام وشرطات فقط"),
    discountType: z.enum(["percentage", "fixed"]).default("percentage"),
    discountValue: z.number().positive("قيمة الخصم يجب أن تكون أكبر من الصفر").max(100_000, "قيمة الخصم غير واقعية"),
    minOrderValue: z.number().min(0).max(1_000_000).default(0),
    usageLimit: z.number().int().positive("الحد الأقصى للاستخدام يجب أن يكون أكبر من صفر").max(1_000_000).optional().nullable(),
    isActive: z.boolean().default(true),
    expiresAt: z.string().optional().nullable(),
  })
  .refine(
    (data) => data.discountType !== "percentage" || data.discountValue <= 100,
    { message: "نسبة الخصم المئوية لا يمكن أن تتجاوز 100%" }
  );

export const updateCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "كود الكوبون يجب أن يحتوي على حرفين على الأقل")
    .max(50, "كود الكوبون يجب ألا يتجاوز 50 حرفاً")
    .regex(/^[A-Za-z0-9_-]+$/, "كود الكوبون يجب أن يحتوي على أحرف وأرقام وشرطات فقط")
    .optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().positive("قيمة الخصم يجب أن تكون أكبر من الصفر").max(100_000, "قيمة الخصم غير واقعية").optional(),
  minOrderValue: z.number().min(0).max(1_000_000).optional(),
  usageLimit: z.number().int().positive("الحد الأقصى للاستخدام يجب أن يكون أكبر من صفر").max(1_000_000).optional().nullable(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
