import { getOrdersWithCount, getOrderStatusCounts, getStoreSettings } from "@/lib/data-service";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "إدارة الطلبات والشحنات | لوحة التحكم",
  description: "متابعة وإدارة طلبات وشحنات المتجر",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  await requireAdminServer();

  const sp = await searchParams;
  const page = Number(sp?.page) > 0 ? Number(sp.page) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const status = sp?.status && sp.status !== "all" ? sp.status : undefined;
  const search = sp?.q?.trim() || undefined;

  const [ordersResult, statusCounts, settings] = await Promise.all([
    getOrdersWithCount({ limit, offset, status, search }),
    getOrderStatusCounts(),
    getStoreSettings().catch(() => null),
  ]);

  return (
    <AdminOrdersClient
      initialOrders={ordersResult.orders}
      totalCount={ordersResult.total}
      currentPage={page}
      pageSize={limit}
      statusCounts={statusCounts}
      storeName={settings?.storeName}
    />
  );
}

