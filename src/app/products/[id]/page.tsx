import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlugOrId, getRelatedProducts, getStoreSettings, getProducts } from "@/lib/data-service";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductDetailClient } from "./ProductDetailClient";
import { RelatedProductsSection } from "@/components/store/RelatedProductsSection";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { isAccessoryProduct } from "@/lib/domain/variants";

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
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {
    // ignore malformed URI
  }
  const [product, settings] = await Promise.all([
    getProductBySlugOrId(decodedId),
    getStoreSettings().catch(() => null),
  ]);
  const brandName = settings?.storeName || STORE_DEFAULTS.storeName;

  if (!product) {
    return {
      title: `المنتج غير موجود | ${brandName}`,
      description: "عذراً، لم نتمكن من العثور على الموديل المطلوب في متجرنا.",
    };
  }

  const isAccessory = isAccessoryProduct(product);
  const title = `${product.name} | ${brandName}`;
  const description =
    product.description?.slice(0, 160) ||
    (isAccessory
      ? `تسوق ${product.name} بجودة استثنائية وأناقة عصرية من متجر ${brandName}. شحن لكافة محافظات مصر ودفع عند الاستلام وإنستاباي.`
      : `${product.name} مصنوع من أجود أنواع القطن المصري مع شحن سريع لجميع محافظات مصر.`);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");
  const rawImage = product.images && product.images.length > 0 ? product.images[0] : `${siteUrl}/opengraph-image`;
  const absoluteImageUrl = rawImage.startsWith("http")
    ? rawImage
    : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  const ogImages = [
    {
      url: absoluteImageUrl,
      width: 1200,
      height: 1200,
      alt: product.name,
    },
  ];

  const primarySlug = product.slug || String(product.id);
  const canonicalPath = `/products/${encodeURIComponent(primarySlug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
      locale: "ar_EG",
      siteName: brandName,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {
    // ignore malformed URI
  }
  const [product, settings] = await Promise.all([
    getProductBySlugOrId(decodedId),
    getStoreSettings(),
  ]);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");
  const productUrl = `${baseUrl}/products/${encodeURIComponent(product.slug || String(product.id))}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku || `MOD-${product.id}`,
    category: product.categoryName || undefined,
    color: product.colors && product.colors.length > 0 ? product.colors.map((c) => c.name).join(", ") : undefined,
    size: product.sizes && product.sizes.length > 0 ? product.sizes.join(", ") : undefined,
    brand: {
      "@type": "Brand",
      name: settings?.storeName || STORE_DEFAULTS.storeName,
    },
    material: isAccessoryProduct(product)
      ? (product.fabricDetails || "خامات متينة وفاخرة خاضعة لفحص الجودة")
      : (product.fabricDetails || "100% Egyptian Cotton - قطن مصري أصيل"),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EGP",
      price: product.salePrice || product.price,
      priceValidUntil: "2027-12-31",
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

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categoryName || "المتجر",
        item: product.categorySlug
          ? `${baseUrl}/products?category=${encodeURIComponent(product.categorySlug)}`
          : `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <StoreShell settings={settings}>
      {/* Search Engine & AI Structured Data (JSON-LD: Product & Breadcrumbs) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsJsonLd).replace(/</g, "\\u003c"),
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

