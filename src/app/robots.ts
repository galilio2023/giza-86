import type { MetadataRoute } from "next";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/checkout"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/checkout"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/", "/uploads/", "/opengraph-image"],
        disallow: ["/admin/", "/api/", "/cart", "/checkout", "/track"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
