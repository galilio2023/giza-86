"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function AdminLoginClient({
  isDbConfigured = false,
}: {
  isDbConfigured?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isDbConfigured) {
      toast.success("تم تسجيل الدخول بنجاح (وضع العرض السريع)");
      router.push("/admin");
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (error) {
        toast.error(error.message || "بيانات الدخول غير صحيحة");
        return;
      }
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/admin");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);

    if (!isDbConfigured) {
      toast.success("تم الدخول بحساب مدير متجر GIZA 86 (وضع العرض السريع)");
      router.push("/admin");
      setLoading(false);
      return;
    }

    try {
      const adminEmail = "admin@giza86.com";
      const adminPass = "Giza86Admin2026!";

      const res = await authClient.signIn.email({
        email: adminEmail,
        password: adminPass,
      });

      if (res.error) {
        toast.error("تعذر تسجيل الدخول التلقائي. يرجى إدخال بيانات حساب المدير.");
        return;
      }

      toast.success("تم الدخول بحساب مدير متجر GIZA 86");
      router.push("/admin");
    } catch {
      toast.error("تعذر تسجيل الدخول بحساب التجربة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mb-1">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-neutral-900 font-mono">
          <span className="text-amber-600">GIZA</span> 86 • CMS
        </h1>
        <p className="text-xs text-neutral-500">
          تسجيل الدخول إلى لوحة التحكم الإدارية (للمسؤولين فقط)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-neutral-800 mb-1">البريد الإلكتروني للمسؤول</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@giza86.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-base sm:text-xs text-left focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">كلمة المرور</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-base sm:text-xs text-left focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
        >
          <span>{loading ? "جاري التحقق..." : "تسجيل الدخول"}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Login & Store Link */}
      <div className="pt-2 border-t border-neutral-100 space-y-3">
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={loading}
          className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>دخول فوري بحساب المدير الافتراضي</span>
        </button>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span className="text-[11px] text-neutral-400">
            * يتم إنشاء حسابات المسؤولين الجدد عبر خادم النظام CLI فقط
          </span>

          <Link href="/" className="hover:text-neutral-900 flex items-center gap-1 font-semibold">
            <span>المتجر</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
