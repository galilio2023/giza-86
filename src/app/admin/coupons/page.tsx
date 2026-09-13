import { getCoupons } from "@/lib/data-service";
import { AdminCouponsClient } from "@/components/admin/AdminCouponsClient";
import { requireAdminServer } from "@/lib/auth-guard";

export const metadata = {
  title: "كوبونات الخصم والعروض | لوحة التحكم",
  description: "إدارة كوبونات الخصم والعروض الترويجية لمتجر GIZA 86",
};

export default async function AdminCouponsPage() {
  await requireAdminServer();

  const coupons = await getCoupons();

  return <AdminCouponsClient initialCoupons={coupons} />;
}
