import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlugOrId, getRelatedProducts, getStoreSettings, getProducts } from "@/lib/data-service";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductDetailClient } from "./ProductDetailClient";
import { RelatedProductsSection } from "@/components/store/RelatedProductsSection";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  // Pre-render top 50 products at build time for optimal build performance
  // Long-tail products are rendered on-demand and cached via ISR
  const topProducts = await getProducts({ limit: 50 });
  return topProducts.flatMap((product) => [
    { id: product.slug },
    { id: String(product.id) },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlugOrId(id),
    getStoreSettings().catch(() => null),
  ]);
  const brandName = settings?.storeName || STORE_DEFAULTS.storeName;

  if (!product) {
    return {
      title: `المنتج غير موجود | ${brandName}`,
      description: "عذراً، لم نتمكن من العثور على الموديل المطلوب في متجرنا.",
    };
  }

  const title = `${product.name} | ${brandName}`;
  const description =
    product.description?.slice(0, 160) ||
    `${product.name} مصنوع من أجود أنواع القطن المصري مع شحن سريع لجميع محافظات مصر.`;

  const ogImages = product.images && product.images.length > 0 ? [product.images[0]] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlugOrId(id),
    getStoreSettings(),
  ]);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://giza86.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: settings?.storeName || STORE_DEFAULTS.storeName,
    },
    material: "100% Egyptian Cotton - خيوط قطن مصري جيزة 86",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug || product.id}`,
      priceCurrency: "EGP",
      price: product.salePrice || product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: settings?.storeName || STORE_DEFAULTS.storeName,
      },
    },
  };

  return (
    <StoreShell settings={settings}>
      {/* Search Engine & AI Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailClient
        product={product}
        relatedProductsSlot={<RelatedProductsSection products={relatedProducts} />}
        settings={settings}
      />
    </StoreShell>
  );
}

