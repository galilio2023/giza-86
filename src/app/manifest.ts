import type { MetadataRoute } from "next";
import { getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getStoreSettings().catch(() => null);
  const name = settings?.storeName || STORE_DEFAULTS.storeName;
  const description = settings?.storeDescription || STORE_DEFAULTS.storeDescription;

  return {
    name,
    short_name: name,
    description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/modanil-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
