import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { updateCategory, deleteCategory, getCategoryById } from "@/lib/data-service";
import { updateCategorySchema } from "@/lib/validations";
import { withAdminAuth, withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ error: "القسم غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(category);
  },
  "فشل في جلب القسم"
);

export const PATCH = withAdminAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "معرّف القسم غير صالح", code: "INVALID_ID" }, { status: 400 });
    }

    const rawBody = await request.json();
    const validated = updateCategorySchema.parse(rawBody);

    const updated = await updateCategory(numId, {
      ...validated,
      description: validated.description ?? undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "القسم غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }

    revalidateTag("categories", "default");
    revalidatePath("/");
    revalidatePath("/products");
    return NextResponse.json(updated);
  },
  "فشل في تعديل القسم"
);

// Support both PUT and PATCH for update operations
export const PUT = PATCH;

export const DELETE = withAdminAuth(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "معرّف القسم غير صالح", code: "INVALID_ID" }, { status: 400 });
    }

    const deleted = await deleteCategory(numId);
    if (!deleted) {
      return NextResponse.json({ error: "القسم غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }
    revalidateTag("categories", "default");
    revalidatePath("/");
    revalidatePath("/products");
    return NextResponse.json({ success: true });
  },
  "فشل في حذف القسم"
);
