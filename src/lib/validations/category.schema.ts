import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "اسم القسم مطلوب").max(100, "اسم القسم يجب ألا يتجاوز 100 حرف"),
  slug: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  image: z
    .string()
    .trim()
    .default("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"),
  displayOrder: z.number().int().min(0).max(10_000).default(0),
  parentId: z.number().int().positive().nullable().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  image: z.string().trim().optional(),
  displayOrder: z.number().int().min(0).max(10_000).optional(),
  parentId: z.number().int().positive().nullable().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
