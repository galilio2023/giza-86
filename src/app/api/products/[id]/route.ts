import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getProductBySlugOrId, updateProduct, deleteProduct } from "@/lib/data-service";
import { updateProductSchema } from "@/lib/validations/product.schema";
import { withAdminAuth, withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const product = await getProductBySlugOrId(id);
    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(product);
  },
  "فشل في جلب المنتج"
);

export const PATCH = withAdminAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "معرّف المنتج غير صالح", code: "INVALID_ID" }, { status: 400 });
    }

    const rawBody = await request.json();
    const validated = updateProductSchema.parse(rawBody);

    const updated = await updateProduct(numId, {
      ...validated,
      salePrice: validated.salePrice === null ? 0 : validated.salePrice,
      fabricDetails: validated.fabricDetails === null ? "" : validated.fabricDetails,
      sku: validated.sku === null ? "" : validated.sku,
    });

    if (!updated) {
      return NextResponse.json({ error: "المنتج غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }

    revalidateTag("products", "default");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    if (updated.slug) {
      revalidatePath(`/products/${updated.slug}`);
    }
    return NextResponse.json(updated);
  },
  "فشل في تعديل المنتج"
);

// Support both PUT and PATCH for update operations
export const PUT = PATCH;

export const DELETE = withAdminAuth(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "معرّف المنتج غير صالح", code: "INVALID_ID" }, { status: 400 });
    }

    const deleted = await deleteProduct(numId);
    if (!deleted) {
      return NextResponse.json({ error: "المنتج غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }

    revalidateTag("products", "default");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return NextResponse.json({ success: true });
  },
  "فشل في حذف المنتج"
);
