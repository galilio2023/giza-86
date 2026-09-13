import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { CartClient } from "@/components/store/CartClient";
import { getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;

  return {
    title: `سلة المشتريات | ${brandName}`,
    description: `راجع المنتجات والمقاسات المختارة في متجر ${brandName} واستفد من الشحن المجاني للطلبات فوق ${settings?.freeShippingThreshold || STORE_DEFAULTS.freeShippingThreshold} ج.م.`,
  };
}

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <StoreShell settings={settings}>
      <CartClient settings={settings} />
    </StoreShell>
  );
}
