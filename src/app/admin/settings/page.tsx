import { getStoreSettings } from "@/lib/data-service";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "إعدادات المتجر والشحن | لوحة التحكم",
  description: "إعدادات متجر MODANIL والشحن لجميع المحافظات",
};

export default async function AdminSettingsPage() {
  await requireAdminServer();

  const settings = await getStoreSettings();

  return <AdminSettingsClient initialSettings={settings} />;
}
