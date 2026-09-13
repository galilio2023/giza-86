import Link from "next/link";
import { LayoutDashboard, ShoppingBag } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-6 shadow-xs">
        <span className="font-mono text-6xl font-black text-amber-500 block">
          404
        </span>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-neutral-900">
            الصفحة أو السجل الإداري غير موجود
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            الطلب أو المنتج أو القسم الذي تبحث عنه قد تم حذفه أو أن الرابط غير صحيح.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Link
            href="/admin"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>لوحة التحكم الرئيسية</span>
          </Link>

          <Link
            href="/admin/orders"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>قائمة الطلبات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
