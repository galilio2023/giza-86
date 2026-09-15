"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Tag, 
  Settings, 
  Store, 
  Menu, 
  Database, 
  ExternalLink,
  Shirt,
  LogOut,
  UserCheck,
  BookOpen
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { BrandLogo } from "@/components/store/BrandLogo";

/** Renders responsive admin navigation shell with session checks, database status indicator, and mobile menu. */
export function AdminShellClient({
  children,
  isDbConfigured = false,
  storeName,
  isAdminServer,
}: {
  children: React.ReactNode;
  isDbConfigured?: boolean;
  storeName?: string;
  isAdminServer?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isAdminServer) return;
    if (!isPending && pathname !== "/admin/login") {
      const role = (session?.user as { role?: string } | undefined)?.role;
      const email = session?.user?.email?.toLowerCase();
      const configuredAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()?.trim() || "admin@modanil.com";
      const isAdmin = Boolean(session?.user && (role === "admin" || email === configuredAdminEmail));
      if (!isAdmin) {
        router.push("/admin/login");
      }
    }
  }, [isPending, session, pathname, router, isAdminServer]);

  // If we are on /admin/login, render login page directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.info("تم تسجيل الخروج");
    router.push("/admin/login");
  };

  const navItems = [
    { label: "لوحة التحكم العامة", href: "/admin", icon: LayoutDashboard },
    { label: "إدارة المنتجات والمخزون", href: "/admin/products", icon: Shirt },
    { label: "إدارة الطلبات والشحن", href: "/admin/orders", icon: ShoppingBag },
    { label: "الأقسام والتصنيفات", href: "/admin/categories", icon: Layers },
    { label: "كوبونات الخصم والعروض", href: "/admin/coupons", icon: Tag },
    { label: "إعدادات المتجر والشحن", href: "/admin/settings", icon: Settings },
    { label: "دليل تشغيل المتجر 💡", href: "/admin/guide", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-100/70 text-neutral-900" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-neutral-950 text-white border-l border-neutral-800 flex-shrink-0">
        {/* Brand header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <BrandLogo
              name={storeName}
              size="sm"
              isDark={true}
              href="/admin"
              showSubtext={false}
            />
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider whitespace-nowrap mt-1">
              لوحة الإدارة والمحتوى • CMS
            </span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            مصر 🇪🇬
          </span>
        </div>

        {/* Database Status Indicator */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2.5">
          <Database className="w-4 h-4 text-emerald-400" />
          <div className="flex-1">
            <span className="text-[11px] font-bold text-white block">
              قاعدة البيانات: Neon Postgres
            </span>
            <span className="text-[10px] text-emerald-400 block">
              {isDbConfigured ? "متصل بقاعدة البيانات الحية" : "وضع العرض السريع"}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-amber-500 text-neutral-950 shadow-md"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-neutral-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Session / Sign In Box */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {session ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <div className="truncate max-w-[150px]">
                <span className="text-white font-bold block truncate">{session.user.name}</span>
                <span className="text-[10px] text-neutral-400 truncate block">{session.user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-neutral-400 hover:text-rose-400 p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg hover:bg-neutral-800 transition cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 text-xs font-bold transition border border-neutral-800"
            >
              <UserCheck className="w-4 h-4" />
              <span>تسجيل دخول المسؤول</span>
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span>الذهاب للمتجر الرئيسي</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 shrink-0 cursor-pointer"
              aria-label="فتح القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-black text-neutral-900 truncate">
              {storeName ? `نظام إدارة متجر ${storeName}` : "نظام إدارة متجر الملابس (CMS)"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/guide"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/90 border border-amber-300/80 px-3 py-1.5 rounded-lg transition shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>دليل التشغيل 💡</span>
            </Link>

            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-amber-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>معاينة المتجر</span>
            </Link>

            <div className="flex items-center gap-2 pr-3 border-r border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                {session?.user?.name ? session.user.name[0] : "م"}
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-neutral-900 block">
                  {session?.user?.name || "مدير المتجر"}
                </span>
                <span className="text-[10px] text-neutral-400 block">
                  {session?.user?.email || "صلاحية إدارة كاملة"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="bg-neutral-950 text-white border-neutral-800 p-6 flex flex-col max-w-xs">
            <SheetHeader className="border-b border-neutral-800 pb-4">
              <SheetTitle asChild className="text-white text-base font-bold">
                <div className="flex items-center gap-2 truncate">
                  <BrandLogo
                    name={storeName}
                    size="sm"
                    isDark={true}
                    href="/admin"
                    showSubtext={false}
                  />
                  <span className="text-xs text-neutral-400 font-normal shrink-0">| CMS</span>
                </div>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 space-y-1.5 overflow-y-auto mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    pathname === item.href
                      ? "bg-amber-500 text-neutral-950"
                      : "text-neutral-300 hover:bg-neutral-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-900 text-xs font-bold text-amber-400 mt-auto"
            >
              <Store className="w-4 h-4" />
              <span>العودة للمتجر</span>
            </Link>
          </SheetContent>
        </Sheet>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
