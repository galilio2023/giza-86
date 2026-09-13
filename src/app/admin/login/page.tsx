import type { Metadata } from "next";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { isDatabaseConfigured } from "@/db";
import { getStoreSettings } from "@/lib/data-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  return {
    title: `تسجيل دخول المسؤول | ${brandName}`,
    description: `بوابة تسجيل الدخول الآمنة للوحة تحكم متجر ${brandName}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminLoginPage() {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4" dir="rtl">
      <AdminLoginClient isDbConfigured={isDatabaseConfigured} storeName={brandName} />
    </div>
  );
}

