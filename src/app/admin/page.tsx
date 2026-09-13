import { getDashboardStats, getLowStockProducts } from "@/lib/data-service";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "لوحة التحكم | GIZA 86",
  description: "لوحة الإحصائيات والمتابعة لمتجر GIZA 86",
};

export default async function AdminDashboardPage() {
  await requireAdminServer();

  const [stats, lowStock] = await Promise.all([
    getDashboardStats(),
    getLowStockProducts(5),
  ]);

  return <AdminDashboardClient initialStats={stats} lowStockItems={lowStock} />;
}
