import { getDashboardStats, getLowStockProducts } from "@/lib/data-service";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "لوحة التحكم | MODANIL",
  description: "لوحة الإحصائيات والمتابعة لمتجر MODANIL",
};

export default async function AdminDashboardPage() {
  await requireAdminServer();

  const [stats, lowStock] = await Promise.all([
    getDashboardStats(),
    getLowStockProducts(5),
  ]);

  return <AdminDashboardClient initialStats={stats} lowStockItems={lowStock} />;
}
