import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");

  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  // Static route entries (Only indexable public pages)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Category filter routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(cat.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic product routes with images for Googlebot-Image
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => {
    const rawSlug = product.slug || product.id;
    const slugSegment = encodeURIComponent(rawSlug);
    const absoluteImages = product.images && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("http://") || img.startsWith("https://")
            ? img
            : `${baseUrl}${img.startsWith("/") ? "" : "/"}${img}`
        )
      : undefined;

    return {
      url: `${baseUrl}/products/${slugSegment}`,
      lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.85,
      images: absoluteImages,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
