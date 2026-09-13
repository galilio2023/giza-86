"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-neutral-900">خطأ في لوحة التحكم الإدارية</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            حدث خطأ أثناء معالجة بيانات الإدارة أو الاتصال بقاعدة البيانات.
          </p>
          {error.digest && (
            <span className="text-[10px] text-neutral-400 font-mono block">
              Digest: {error.digest}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة تحميل اللوحة</span>
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-2.5 px-5 rounded-xl text-xs transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
