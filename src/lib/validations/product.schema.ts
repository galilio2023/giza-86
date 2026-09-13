import { z } from "zod";

export const productVariantInputSchema = z.object({
  id: z.number().optional(),
  size: z.string().trim().min(1, "المقاس مطلوب"),
  colorName: z.string().trim().min(1, "اسم اللون مطلوب"),
  colorHex: z.string().trim().default("#000000"),
  sku: z.string().trim().optional(),
  stock: z.number().int().min(0, "مخزون المقاس لا يمكن أن يكون سالباً").default(0),
  price: z.number().positive("السعر يجب أن يكون رقماً موجباً").optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export const baseProductSchema = z.object({
  name: z.string().trim().min(1, "اسم المنتج مطلوب").max(255, "اسم المنتج يجب ألا يتجاوز 255 حرفاً"),
  slug: z.string().trim().max(255).optional(),
  description: z.string().trim().min(1, "وصف المنتج مطلوب"),
  fabricDetails: z.string().trim().max(500).optional().nullable(),
  price: z.number().positive("السعر يجب أن يكون رقماً موجباً أكبر من صفر").max(10_000_000, "السعر غير واقعي"),
  salePrice: z.number().positive("سعر الخصم يجب أن يكون رقماً موجباً").max(10_000_000).optional().nullable(),
  stock: z.number().int().min(0, "المخزون لا يمكن أن يكون سالباً").max(100_000).default(10),
  categoryId: z.number().int().positive("يرجى اختيار قسم صحيح للمنتج"),
  sizes: z.array(z.string().max(20)).default(["S", "M", "L", "XL", "2XL"]),
  colors: z.array(z.object({ name: z.string().max(50), hex: z.string().max(20), imageUrl: z.string().optional() })).default([]),
  variants: z.array(productVariantInputSchema).optional(),
  images: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  sku: z.string().trim().max(50).optional().nullable(),
  hasSizeGuide: z.boolean().optional(),
  badgeText: z.string().trim().max(50).optional().nullable(),
});

export const createProductSchema = baseProductSchema.refine(
  (data) => !data.salePrice || data.salePrice < data.price,
  { message: "سعر التخفيض يجب أن يكون أقل من السعر الأصلي للمنتج", path: ["salePrice"] }
);

export const updateProductSchema = baseProductSchema.partial().refine(
  (data) => !data.salePrice || !data.price || data.salePrice < data.price,
  { message: "سعر التخفيض يجب أن يكون أقل من السعر الأصلي للمنتج", path: ["salePrice"] }
);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
