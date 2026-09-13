"use client";

import { usePathname } from "next/navigation";
import { formatWhatsAppNumber, STORE_DEFAULTS } from "@/lib/egypt-constants";
import { useCartStore } from "@/lib/store";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface WhatsAppFloatProps {
  whatsappNumber?: string;
  storeName?: string;
}

export function WhatsAppFloat({ whatsappNumber: propNumber, storeName }: WhatsAppFloatProps = {}) {
  const pathname = usePathname();
  const isCartOpen = useCartStore((state) => state.isOpen);

  // Hide on admin routes, checkout, product details (which have their own dedicated WhatsApp order button), or when cart drawer is open
  const isProductPage = pathname?.startsWith("/products/") && pathname !== "/products";
  if (
    pathname?.startsWith("/admin") ||
    pathname === "/checkout" ||
    isProductPage ||
    isCartOpen
  ) {
    return null;
  }

  const formattedNumber = formatWhatsAppNumber(propNumber);
  const brandName = storeName || STORE_DEFAULTS.storeName;
  const defaultMessage = encodeURIComponent(
    `مرحباً، أود الاستفسار عن المنتجات والمقاسات المتاحة في متجر ${brandName}.`
  );

  return (
    <aside
      aria-label="واتساب خدمة العملاء"
      className="fixed right-4 sm:right-6 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-6 z-50 transition-all duration-300 print:hidden"
    >
      <a
        href={`https://wa.me/${formattedNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        title="تواصل معنا عبر واتساب"
        className="block group select-none cursor-pointer"
      >
        <WhatsAppIcon
          className="w-13 h-13 sm:w-14 sm:h-14 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] group-hover:scale-110 active:scale-95 transition-transform duration-300"
        />
      </a>
    </aside>
  );
}
