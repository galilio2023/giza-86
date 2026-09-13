import { getStoreSettings } from "@/lib/data-service";
import { AdminGuideClient } from "@/components/admin/AdminGuideClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "دليل تشغيل وإدارة المتجر 💡 | لوحة التحكم",
  description: "شرح شامل خطوة بخطوة لكافة وظائف متجر MODANIL للملابس والإكسسوارات وكيفية إدارته بكفاءة",
};

export default async function AdminGuidePage() {
  await requireAdminServer();

  const settings = await getStoreSettings().catch(() => null);

  return <AdminGuideClient storeName={settings?.storeName || "MODANIL"} />;
}
