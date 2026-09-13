import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { OrderTrackClient } from "@/components/store/OrderTrackClient";
import { getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  return {
    title: `تتبع حالة الطلب والشحنة | ${brandName}`,
    description: `تابع حالة ومسار شحنتك لجميع محافظات مصر برقم الطلب ورقم الهاتف في متجر ${brandName}.`,
  };
}

export default async function TrackOrderPage() {
  const settings = await getStoreSettings();

  return (
    <StoreShell settings={settings} mainClassName="flex-1 layout-container py-8 sm:py-12 w-full max-w-full">
      <OrderTrackClient settings={settings} />
    </StoreShell>
  );
}
