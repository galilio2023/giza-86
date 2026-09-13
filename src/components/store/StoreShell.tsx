import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { getStoreSettings, getCategories } from "@/lib/data-service";
import { StoreSettingsItem, CategoryItem } from "@/types";

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

  const shellWrapperClass = printHiddenShell ? "print:hidden" : undefined;

  return (
    <div className={`min-h-screen flex flex-col bg-background ${printHiddenShell ? "print:bg-white" : ""}`}>
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
