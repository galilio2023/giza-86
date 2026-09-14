"use client";

import { useState } from "react";
import { Share2, Copy, Check, ExternalLink, Link2 } from "lucide-react";
import { ProductItem } from "@/types";
import { formatEGP } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ProductShareButtonProps {
  product: ProductItem;
  brandName: string;
  currentPrice: number;
}

export function ProductShareButton({
  product,
  brandName,
  currentPrice,
}: ProductShareButtonProps) {
  const [copiedType, setCopiedType] = useState<"rich" | "url" | null>(null);

  const getShareUrl = () => {
    return typeof window !== "undefined" ? window.location.href : "";
  };

  /**
   * Builds an attractive, conversion-focused text snippet containing
   * the brand, product title, price in EGP, Egyptian delivery guarantee, and clean URL.
   */
  const getRichShareText = () => {
    const url = getShareUrl();
    const priceText = formatEGP(currentPrice);

    return (
      `✨ ${product.name} | متجر ${brandName}\n` +
      `💰 السعر: ${priceText}\n` +
      `🚚 شحن لجميع محافظات مصر ومعاينة وفحص الخامة قبل الدفع\n` +
      `💳 الدفع عند الاستلام أو عبر إنستاباي وفودافون كاش\n\n` +
      `🔗 تصفح واطلب الآن: ${url}`
    );
  };

  // Direct WhatsApp Share (desktop or mobile)
  const handleWhatsAppShare = () => {
    const text = getRichShareText();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Native Mobile Share Sheet (iOS / Android / Safari / Chrome)
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | ${brandName}`,
          text: `✨ ${product.name} بسعر ${formatEGP(currentPrice)} في متجر ${brandName}`,
          url: getShareUrl(),
        });
        return;
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyRichDetails();
        }
      }
    } else {
      handleCopyRichDetails();
    }
  };

  // Copy Full Rich Card to Clipboard
  const handleCopyRichDetails = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(getRichShareText());
        setCopiedType("rich");
        toast.success("تم نسخ تفاصيل الموديل والسعر والرابط للحافظة!");
        setTimeout(() => setCopiedType(null), 2500);
      } catch {
        toast.error("تعذر النسخ إلى الحافظة");
      }
    }
  };

  // Copy Clean URL Only
  const handleCopyUrlOnly = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(getShareUrl());
        setCopiedType("url");
        toast.success("تم نسخ رابط المنتج المباشر!");
        setTimeout(() => setCopiedType(null), 2500);
      } catch {
        toast.error("تعذر النسخ إلى الحافظة");
      }
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-neutral-600 hover:text-neutral-950 text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 shadow-2xs transition-all duration-200 cursor-pointer active:scale-95"
          title="مشاركة هذا الموديل"
          aria-label="مشاركة المنتج"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-600" />
          <span>مشاركة</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5 rounded-2xl shadow-xl border-neutral-200 bg-white">
        <DropdownMenuLabel className="text-[11px] font-bold text-neutral-400 px-3 py-1.5">
          مشاركة هذا الموديل
        </DropdownMenuLabel>

        {/* Option 1: WhatsApp Direct Share */}
        <DropdownMenuItem
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-800 hover:text-emerald-700 hover:bg-emerald-50/60 cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center flex-shrink-0">
            <WhatsAppIcon variant="pure" className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 text-right">
            <span className="block leading-none">إرسال عبر واتساب</span>
            <span className="text-[10px] text-neutral-400 font-normal">جاهز مع السعر والتفاصيل</span>
          </div>
        </DropdownMenuItem>

        {/* Option 2: Native Share (System Apps on mobile) */}
        {hasNativeShare && (
          <DropdownMenuItem
            onClick={handleNativeShare}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-700" />
            </div>
            <div className="flex-1 text-right">
              <span className="block leading-none">مشاركة عبر التطبيقات</span>
              <span className="text-[10px] text-neutral-400 font-normal">إنستغرام، فيسبوك، ماسنجر</span>
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="my-1 border-neutral-100" />

        {/* Option 3: Copy Rich Details + Link */}
        <DropdownMenuItem
          onClick={handleCopyRichDetails}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-800 hover:text-amber-700 hover:bg-amber-50/60 cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center flex-shrink-0">
            {copiedType === "rich" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-700" />
            )}
          </div>
          <div className="flex-1 text-right">
            <span className="block leading-none">نسخ النص والرابط معاً</span>
            <span className="text-[10px] text-neutral-400 font-normal">ملخص الموديل والسعر واللينك</span>
          </div>
        </DropdownMenuItem>

        {/* Option 4: Copy Direct URL Only */}
        <DropdownMenuItem
          onClick={handleCopyUrlOnly}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
            {copiedType === "url" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Link2 className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </div>
          <div className="flex-1 text-right">
            <span className="block leading-none">نسخ الرابط فقط</span>
            <span className="text-[10px] text-neutral-400 font-normal">رابط المتصفح المباشر</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
