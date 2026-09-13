import { getAdminProductsWithCount, getCategories } from "@/lib/data-service";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "إدارة المنتجات والمخزون | لوحة التحكم",
  description: "إدارة وتعديل المنتجات والمخزون في متجر MODANIL",
};

interface AdminProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdminServer();

  const sp = await searchParams;
  const page = Number(sp?.page) > 0 ? Number(sp.page) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const categoryId = sp?.category && sp.category !== "all" ? Number(sp.category) : undefined;
  const search = sp?.q?.trim() || undefined;

  const [productsResult, categories] = await Promise.all([
    getAdminProductsWithCount({
      limit,
      offset,
      categoryId,
      search,
    }),
    getCategories(),
  ]);

  return (
    <AdminProductsClient
      initialProducts={productsResult.products}
      totalCount={productsResult.total}
      currentPage={page}
      pageSize={limit}
      categories={categories}
    />
  );
}

