import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getProducts, getProductsWithCount, createProduct } from "@/lib/data-service";
import { createProductSchema } from "@/lib/validations";
import { withAdminAuth, withErrorHandler } from "@/lib/api-handler";
import { slugify } from "@/lib/utils";

import {
  parsePaginationParams,
  parseStringParam,
  parseNumberParam,
  parseBooleanParam,
} from "@/lib/query-parser";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const { limit, offset, withCount } = parsePaginationParams(searchParams, 20);

  const categorySlug = parseStringParam(searchParams, "category");
  const categoryId = parseNumberParam(searchParams, "categoryId");
  const featured = parseBooleanParam(searchParams, "featured");
  const onSale = parseBooleanParam(searchParams, "onSale");
  const inStock = parseBooleanParam(searchParams, "inStock");
  const size = parseStringParam(searchParams, "size");
  const minPrice = parseNumberParam(searchParams, "minPrice");
  const maxPrice = parseNumberParam(searchParams, "maxPrice");
  const search = parseStringParam(searchParams, "search");
  const sortByParam = parseStringParam(searchParams, "sort");
  const sortBy = sortByParam === "price-asc" || sortByParam === "price-desc" || sortByParam === "oldest"
    ? sortByParam
    : undefined;

  if (withCount) {
    const result = await getProductsWithCount({
      categorySlug,
      categoryId,
      featured,
      onSale,
      inStock,
      size,
      minPrice,
      maxPrice,
      search,
      sortBy,
      limit,
      offset,
    });
    const cacheHeader = search ? "no-store" : "public, s-maxage=60, stale-while-revalidate=600";
    return NextResponse.json(result, {
      headers: {
        "X-Total-Count": String(result.total),
        "Cache-Control": cacheHeader,
      },
    });
  }

  const products = await getProducts({
    categorySlug,
    categoryId,
    featured,
    onSale,
    inStock,
    size,
    minPrice,
    maxPrice,
    search,
    sortBy,
    limit,
    offset,
  });

  const cacheHeader = search ? "no-store" : "public, s-maxage=60, stale-while-revalidate=600";
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": cacheHeader,
    },
  });
}, "فشل في جلب المنتجات");

export const POST = withAdminAuth(async (request: Request) => {
  const rawBody = await request.json();
  const validated = createProductSchema.parse(rawBody);

  const baseSlug = slugify(validated.slug || validated.name);
  const slug = validated.slug
    ? baseSlug
    : `${baseSlug || "prod"}-${Date.now().toString(36)}`;

  const newProduct = await createProduct({
    ...validated,
    slug,
    fabricDetails: validated.fabricDetails || undefined,
    sku: validated.sku || undefined,
    salePrice: validated.salePrice || undefined,
    badgeText: validated.badgeText || undefined,
  });

  revalidateTag("products", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(newProduct, { status: 201 });
}, "فشل في إضافة المنتج");
