import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { getStoreSettings, getCategories } from "@/lib/data-service";
import { StoreSettingsItem, CategoryItem } from "@/types";
import { MaintenanceScreen } from "@/components/store/MaintenanceScreen";
import { validateAdminSession } from "@/lib/auth-guard";

export interface StoreShellProps {
  children: React.ReactNode;
  settings?: StoreSettingsItem | null;
  categories?: CategoryItem[];
  mainClassName?: string;
  skipMainTag?: boolean;
  printHiddenShell?: boolean;
}

export async function StoreShell({
  children,
  settings: propSettings,
  categories: propCategories,
  mainClassName = "flex-1 w-full max-w-full",
  skipMainTag = false,
  printHiddenShell = false,
}: StoreShellProps) {
  const [resolvedSettings, resolvedCategories] = await Promise.all([
    propSettings !== undefined ? propSettings : getStoreSettings().catch(() => null),
    propCategories !== undefined ? propCategories : getCategories().catch(() => []),
  ]);

  // Master Kill Switch: Check maintenance mode
  if (resolvedSettings?.isMaintenanceMode) {
    const adminAuth = await validateAdminSession().catch(() => ({ isAdmin: false, user: null }));
    if (!adminAuth.isAdmin) {
      return <MaintenanceScreen settings={resolvedSettings} />;
    }
  }

  const shellWrapperClass = printHiddenShell ? "print:hidden" : undefined;

  return (
    <div className={`min-h-screen flex flex-col bg-background ${printHiddenShell ? "print:bg-white" : ""}`}>
      {resolvedSettings?.isMaintenanceMode && (
        <div className="bg-rose-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 z-50">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>المتجر حالياً في وضع الصيانة والتحديث (مغلق أمام الزوار) - أنت تتصفح كمسؤول</span>
          <Link href="/admin/settings" className="underline hover:text-amber-200 mr-2">
            لوحة الإعدادات
          </Link>
        </div>
      )}
      <div className={shellWrapperClass}>
        <Navbar settings={resolvedSettings || undefined} categories={resolvedCategories} />
      </div>
      {skipMainTag ? (
        children
      ) : (
        <main id="main-content" className={mainClassName}>
          {children}
        </main>
      )}
      <div className={shellWrapperClass}>
        <Footer settings={resolvedSettings || undefined} categories={resolvedCategories} />
      </div>
    </div>
  );
}
