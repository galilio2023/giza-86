import type { Metadata } from "next";
import { AdminShellClient } from "@/components/admin/AdminShellClient";
import { isDatabaseConfigured } from "@/db";
import { getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  return {
    title: `لوحة التحكم CMS | ${brandName}`,
    description: "نظام إدارة الموديلات، المخزون، الطلبات، وأسعار الشحن لمحافظات مصر.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  return (
    <AdminShellClient isDbConfigured={isDatabaseConfigured} storeName={brandName}>
      {children}
    </AdminShellClient>
  );
}

