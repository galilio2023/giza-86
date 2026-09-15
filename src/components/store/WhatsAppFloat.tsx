"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { formatWhatsAppNumber, STORE_DEFAULTS } from "@/lib/egypt-constants";
import { useCartStore } from "@/lib/store";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { MessageSquare, RefreshCw, X } from "lucide-react";

interface WhatsAppFloatProps {
  whatsappNumber?: string;
  supportWhatsapp?: string;
  storeName?: string;
}

/** Renders persistent floating WhatsApp customer support widget with direct quick-chat channels. */
export function WhatsAppFloat({
  whatsappNumber: propNumber,
  supportWhatsapp: propSupportNumber,
  storeName,
}: WhatsAppFloatProps = {}) {
  const pathname = usePathname();
  const isCartOpen = useCartStore((state) => state.isOpen);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close dual-channel menu on outside click or escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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

  const salesNumber = formatWhatsAppNumber(propNumber);
  const supportNumber = formatWhatsAppNumber(propSupportNumber);
  const hasDualChannels = Boolean(propSupportNumber && propSupportNumber !== propNumber && supportNumber !== salesNumber);
  const brandName = storeName || STORE_DEFAULTS.storeName;

  const salesMessage = encodeURIComponent(
    `مرحباً، أود الاستفسار عن المنتجات والمقاسات المتاحة في متجر ${brandName}.`
  );
  const supportMessage = encodeURIComponent(
    `مرحباً، أحتاج مساعدة بخصوص طلب سابق أو خدمة ما بعد البيع / استبدال في متجر ${brandName}.`
  );

  return (
    <aside
      ref={popupRef}
      aria-label="واتساب خدمة العملاء"
      className="fixed right-4 sm:right-6 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-6 z-50 transition-all duration-300 print:hidden"
    >
      {/* Dual Channel Popup Menu */}
      {hasDualChannels && isOpen && (
        <div
          dir="rtl"
          className="absolute bottom-16 sm:bottom-18 right-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div className="flex items-center gap-1.5">
              <WhatsAppIcon className="w-5 h-5" />
              <span className="text-xs font-bold text-neutral-900">تواصل عبر واتساب</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
              aria-label="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
            اختر القسم المطلوب للتواصل المباشر مع فريق عمل {brandName}:
          </p>

          <div className="space-y-1.5">
            {/* Sales WhatsApp */}
            <a
              href={`https://wa.me/${salesNumber}?text=${salesMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-800">
                  المبيعات والاستفسار العام
                </div>
                <div className="text-[10px] text-neutral-500">
                  للاستفسار عن الموديلات والمقاسات والطلبات
                </div>
              </div>
            </a>

            {/* Support / Returns WhatsApp */}
            <a
              href={`https://wa.me/${supportNumber}?text=${supportMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/80 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-800">
                  الاستبدال والدعم الفني
                </div>
                <div className="text-[10px] text-neutral-500">
                  لخدمات ما بعد البيع ومقاسات الاستبدال
                </div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      {hasDualChannels ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="تواصل عبر واتساب"
          title="تواصل معنا عبر واتساب"
          className="block group select-none cursor-pointer focus:outline-none"
        >
          <WhatsAppIcon
            className="w-13 h-13 sm:w-14 sm:h-14 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] group-hover:scale-110 active:scale-95 transition-transform duration-300"
          />
        </button>
      ) : (
        <a
          href={`https://wa.me/${salesNumber}?text=${salesMessage}`}
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
      )}
    </aside>
  );
}
