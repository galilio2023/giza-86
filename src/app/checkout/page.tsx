import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { CheckoutClient } from "@/components/store/CheckoutClient";
import { getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  return {
    title: `إتمام الطلب وبيانات الشحن | ${brandName}`,
    description: `أدخل عنوان التوصيل في محافظات مصر لطلبك من متجر ${brandName} واختر طريقة الدفع (كاش، إنستاباي، فودافون كاش).`,
  };
}

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <StoreShell settings={settings}>
      <CheckoutClient settings={settings} />
    </StoreShell>
  );
}
