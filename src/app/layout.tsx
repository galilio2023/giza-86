import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartDrawer } from "@/components/store/CartDrawer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

import { getStoreSettings } from "@/lib/data-service";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || STORE_DEFAULTS.siteUrl).replace(/\/+$/, "");
  const title = settings?.seoTitle ? `${brandName} - ${settings.seoTitle}` : `${brandName} - متجر الأزياء والقطن المصري الفاخر`;
  const description = settings?.seoDescription || `تسوق تشكيلة الأزياء الكاجوال والأوفر سايز والهوديز المصنوعة من أفخر قطن مصري في متجر ${brandName}. شحن لكافة المحافظات ودفع عند الاستلام وإنستاباي.`;
  const keywords = settings?.seoKeywords ? settings.seoKeywords.split(",").map((k) => k.trim()) : [brandName, "قطن مصري", "ملابس كاجوال", "أوفر سايز", "هوديز", "إنستاباي", "فودافون كاش", "متجر مصري"];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "ar_EG",
      url: siteUrl,
      siteName: brandName,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${brandName} | Luxury Egyptian Cotton Apparel`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [
        { url: "/images/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings().catch(() => null);

  return (
    <html lang="ar" dir="rtl" className={cairo.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 overflow-x-hidden w-full max-w-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-neutral-950 focus:text-amber-400 focus:font-bold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          الانتقال إلى المحتوى الرئيسي
        </a>
        {children}
        <CartDrawer freeShippingThreshold={settings?.freeShippingThreshold} />
        <WhatsAppFloat
          whatsappNumber={settings?.whatsapp}
          supportWhatsapp={settings?.supportWhatsapp}
          storeName={settings?.storeName}
        />
        <MobileBottomNav />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
