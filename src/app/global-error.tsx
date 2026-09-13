"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { STORE_DEFAULTS, formatWhatsAppNumber } from "@/lib/egypt-constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash caught:", error);
  }, [error]);

  const emergencyWa = formatWhatsAppNumber(STORE_DEFAULTS.whatsapp);
  const whatsappEmergency = encodeURIComponent(
    `تقرير عطل طارئ في متجر ${STORE_DEFAULTS.storeName}:\nالخطأ: ${error.message}\nالكود: ${error.digest || "N/A"}`
  );

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white">حدث خطأ تقني غير متوقع</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              نعتذر عن هذا الخطأ، تم تسجيل تفاصيل المشكلة وجاري العمل على معالجتها من قبل فريق الدعم الفني.
            </p>
            {error.digest && (
              <p className="text-[10px] text-neutral-500 font-mono bg-neutral-950/60 p-2 rounded-lg">
                كود المتابعة: {error.digest}
              </p>
            )}
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 px-4 rounded-xl text-xs transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة وتحديث الصفحة</span>
            </button>

            <a
              href={`https://wa.me/${emergencyWa}?text=${whatsappEmergency}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-neutral-950 hover:bg-neutral-800 text-white border border-[#c59b27]/80 hover:border-amber-400 font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-300 shadow-md group cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className="group-hover:text-amber-300 transition-colors">إبلاغ الدعم الفني عبر واتساب</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
