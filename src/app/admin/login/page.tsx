import type { Metadata } from "next";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { isDatabaseConfigured } from "@/db";

export const metadata: Metadata = {
  title: `تسجيل دخول المسؤول | ${STORE_DEFAULTS.storeName}`,
  description: "بوابة تسجيل الدخول الآمنة للوحة تحكم متجر جيزة 86.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4" dir="rtl">
      <AdminLoginClient isDbConfigured={isDatabaseConfigured} />
    </div>
  );
}
