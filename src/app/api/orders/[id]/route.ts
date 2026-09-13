import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getOrderById, updateOrderStatus } from "@/lib/data-service";
import { withAdminAuth } from "@/lib/api-handler";
import { OrderItem } from "@/types";
import { z } from "zod";

const updateOrderSchema = z.object({
  orderStatus: z
    .enum(["new", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
  trackingNumber: z.string().trim().max(100).optional(),
});

export const GET = withAdminAuth(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    // allowNumericId = true so admins can lookup by numeric ID or orderNumber
    const order = await getOrderById(id, true);
    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(order);
  },
  "فشل في جلب تفاصيل الطلب"
);

export const PATCH = withAdminAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = updateOrderSchema.parse(body);

    if (
      validated.orderStatus === undefined &&
      validated.paymentStatus === undefined &&
      validated.trackingNumber === undefined
    ) {
      return NextResponse.json({ error: "لا توجد تعديلات لتحديثها", code: "NO_UPDATES" }, { status: 400 });
    }

    const updated = await updateOrderStatus(
      id,
      validated.orderStatus as OrderItem["orderStatus"],
      validated.paymentStatus as OrderItem["paymentStatus"],
      validated.trackingNumber
    );

    if (!updated) {
      return NextResponse.json({ error: "الطلب غير موجود", code: "NOT_FOUND" }, { status: 404 });
    }

    // Synchronize catalog cache when order status transitions impact product inventory
    revalidateTag("products", "default");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/order-success/${updated.orderNumber}`);
    revalidatePath(`/order-success/${updated.id}`);
    revalidatePath("/track");
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return NextResponse.json(updated);
  },
  "فشل في تحديث حالة الطلب"
);
