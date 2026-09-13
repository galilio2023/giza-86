import Link from "next/link";
import { Search, Home, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-20 text-center flex flex-col items-center justify-center space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-7xl sm:text-8xl font-black text-amber-500 tracking-tight block">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            الصفحة المطلوبة غير موجودة
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            ربما تم نقل هذا المنتج، أو انتهت صلاحية الرابط، أو تم حذفه من التشكيلة الحالية.
          </p>
        </div>

        {/* Quick Search Redirect */}
        <div className="w-full max-w-md">
          <form action="/products" method="GET" className="relative w-full">
            <input
              type="text"
              name="q"
              placeholder="ابحث عن تيشيرت، هودي، قميص..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 bg-white text-xs shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>العودة للرئيسية</span>
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-bold px-6 py-3 rounded-xl text-xs transition shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-500" />
            <span>تصفح كافة المنتجات</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
