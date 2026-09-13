import { getCategories } from "@/lib/data-service";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "أقسام وتصنيفات المتجر | لوحة التحكم",
  description: "إدارة أقسام وتصنيفات المنتجات في متجر MODANIL",
};

export default async function AdminCategoriesPage() {
  await requireAdminServer();

  const categories = await getCategories();

  return <AdminCategoriesClient initialCategories={categories} />;
}
