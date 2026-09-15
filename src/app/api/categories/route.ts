import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCategories, createCategory } from "@/lib/data-service";
import { createCategorySchema } from "@/lib/validations";
import { withAdminAuth, withErrorHandler } from "@/lib/api-handler";
import { slugify } from "@/lib/utils";

export const GET = withErrorHandler(async () => {
  const list = await getCategories();
  return NextResponse.json(list, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}, "فشل في جلب الأقسام");

export const POST = withAdminAuth(async (request: Request) => {
  const rawBody = await request.json();
  const validated = createCategorySchema.parse(rawBody);

  const baseSlug = slugify(validated.slug || validated.name);
  const slug = validated.slug ? baseSlug : (baseSlug || `cat-${Date.now().toString(36)}`);

  const created = await createCategory({
    name: validated.name,
    slug,
    image: validated.image,
    description: validated.description || undefined,
    displayOrder: validated.displayOrder,
    parentId: validated.parentId ?? null,
  });

  revalidateTag("categories", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json(created, { status: 201 });
}, "فشل في إضافة القسم");
