import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getOrders, getOrdersWithCount, createOrder } from "@/lib/data-service";
import { generateOrderNumber } from "@/lib/utils";
import { createOrderSchema } from "@/lib/validations";
import { withAdminAuth, withErrorHandler } from "@/lib/api-handler";
import { rateLimitGuard } from "@/lib/rate-limiter";

import { parsePaginationParams, parseStringParam } from "@/lib/query-parser";

export const GET = withAdminAuth(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const { limit, offset, withCount } = parsePaginationParams(searchParams, 20);

  const status = parseStringParam(searchParams, "status");
  const paymentStatus = parseStringParam(searchParams, "paymentStatus");
  const paymentMethod = parseStringParam(searchParams, "paymentMethod");
  const governorate = parseStringParam(searchParams, "governorate");
  const search = parseStringParam(searchParams, "search");

  if (withCount) {
    const result = await getOrdersWithCount({
      status,
      paymentStatus,
      paymentMethod,
      governorate,
      search,
      limit,
      offset,
    });
    return NextResponse.json(result, {
      headers: {
        "X-Total-Count": String(result.total),
      },
    });
  }

  const orders = await getOrders({
    status,
    paymentStatus,
    paymentMethod,
    governorate,
    search,
    limit,
    offset,
  });
  return NextResponse.json(orders);
}, "فشل في جلب الطلبات");

export const POST = withErrorHandler(async (request: Request) => {
  const rateLimitError = await rateLimitGuard(request, "checkout", { maxRequests: 5, windowSeconds: 60 });
  if (rateLimitError) return rateLimitError;

  const rawBody = await request.json();
  const validated = createOrderSchema.parse(rawBody);

  const orderNumber = generateOrderNumber();

  const newOrder = await createOrder({
    ...validated,
    alternatePhone: validated.alternatePhone || undefined,
    notes: validated.notes || undefined,
    couponCode: validated.couponCode || undefined,
    orderNumber,
    orderStatus: "new",
    paymentStatus: "pending",
    items: validated.items.map((i) => ({
      ...i,
      image: i.image || "",
    })),
  });

  revalidateTag("products", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return NextResponse.json(newOrder, { status: 201 });
}, "فشل في إتمام الطلب");
