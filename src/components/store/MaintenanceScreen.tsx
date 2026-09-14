import Link from "next/link";
import { Wrench, Lock } from "lucide-react";
import { StoreSettingsItem } from "@/types";
import { STORE_DEFAULTS, formatWhatsAppNumber } from "@/lib/egypt-constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BrandLogo } from "@/components/store/BrandLogo";

export function MaintenanceScreen({
  settings,
}: {
  settings?: StoreSettingsItem | null;
}) {
  const brandName = settings?.storeName || STORE_DEFAULTS.storeName;
  const whatsappNum = formatWhatsAppNumber(settings?.whatsapp || STORE_DEFAULTS.whatsapp);
  const message =
    settings?.maintenanceMessage ||
    "نعمل حالياً على تحديث وتطوير المتجر وإضافة تشكيلات جديدة لنمنحكم أفضل تجربة تسوق. سنعود للعمل واستقبال الطلبات قريباً جداً!";

  const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    `مرحباً متجر ${brandName}، أود الاستفسار بخصوص موعد عودة المتجر للعمل أو الطلب المباشر.`
  )}`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-4 sm:p-6 selection:bg-amber-500 selection:text-neutral-950"
      dir="rtl"
    >
      <div className="max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
        <div className="flex justify-center">
          <BrandLogo name={brandName} logoUrl={settings?.logoUrl} isDark={true} href="/" showSubtext={false} />
        </div>

        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
            وضع الصيانة والتحديث
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            المتجر قيد الصيانة المؤقتة
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3.5 px-5 rounded-xl text-xs transition shadow-lg active:scale-98 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
            <span>تواصل مع خدمة العملاء عبر واتساب</span>
          </a>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-center gap-4 text-xs text-neutral-500">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>دخول المسؤولين</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
