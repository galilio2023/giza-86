import { cache } from "react";
import { unstable_cache } from "next/cache";
import { StoreSettingsItem } from "@/types";
import { getSettingsRepository } from "@/lib/repositories/settings.repository";

/**
 * Service to fetch store CMS settings.
 * Cached globally across requests via Next.js Data Cache (unstable_cache with tag 'settings')
 * and memoized per request using React cache().
 */
const getCachedStoreSettings = unstable_cache(
  async () => getSettingsRepository().get(),
  ["store-settings-global"],
  {
    revalidate: 3600,
    tags: ["settings"],
  }
);

export const getStoreSettings = cache(async function getStoreSettings(): Promise<StoreSettingsItem> {
  const settings = await getCachedStoreSettings();
  if (settings && (settings.storeName === "GIZA 86" || !settings.storeName)) {
    settings.storeName = "MODANIL";
    if (!settings.logoUrl || settings.logoUrl.includes("giza")) {
      settings.logoUrl = "/images/modanil-logo.svg";
    }
  }
  return settings;
});

/**
 * Service to update store settings (branding, hero, shipping rates, and emergency kill switches).
 */
export async function updateStoreSettings(
  newSettings: Partial<StoreSettingsItem>
): Promise<StoreSettingsItem> {
  return getSettingsRepository().update(newSettings);
}
