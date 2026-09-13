"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryItem } from "@/types";

interface NavLinkItem {
  label: string;
  href: string;
  highlight?: boolean;
}

interface NavbarLinksProps {
  categories?: CategoryItem[];
  navLinks?: NavLinkItem[];
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: 1, name: "أوفر سايز", slug: "oversized-tshirts", image: "" },
  { id: 2, name: "هوديز وسويت شيرت", slug: "hoodies-sweatshirts", image: "" },
  { id: 3, name: "قمصان كاجوال", slug: "casual-shirts", image: "" },
  { id: 4, name: "ملابس نسائية", slug: "women-collection", image: "" },
];

function NavbarLinksInner({ categories }: { categories?: CategoryItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const onSale = searchParams.get("onSale") === "true";

  const allCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const isCategoriesActive = pathname === "/products" && !!currentCategory;

  // On extra-wide screens (xl+), show up to 2 popular categories directly in the bar
  const quickCategories = allCategories.slice(0, 2);

  return (
    <nav className="flex items-center gap-1 xl:gap-1.5 text-xs font-bold text-neutral-700 select-none">
      {/* 1. الرئيسية */}
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
          pathname === "/"
            ? "text-white bg-neutral-950 shadow-xs"
            : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
        }`}
      >
        الرئيسية
      </Link>

      {/* 2. جميع الموديلات */}
      <Link
        href="/products"
        aria-current={pathname === "/products" && !currentCategory && !onSale ? "page" : undefined}
        className={`px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
          pathname === "/products" && !currentCategory && !onSale
            ? "text-white bg-neutral-950 shadow-xs"
            : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
        }`}
      >
        جميع الموديلات
      </Link>

      {/* 3. Quick categories (shown only on xl+ to preserve clean breathing room on standard desktops) */}
      {quickCategories.map((c) => {
        const isCatActive = pathname === "/products" && currentCategory === c.slug;
        const shortName = c.name.split(" ")[0] === "تيشيرتات" ? "أوفر سايز" : c.name.split(" ")[0];
        const displayLabel = c.name.length > 15 ? shortName : c.name;

        return (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={`hidden xl:inline-flex px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
              isCatActive
                ? "text-white bg-neutral-950 shadow-xs"
                : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
            }`}
          >
            {displayLabel}
          </Link>
        );
      })}

      {/* 4. الأقسام Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold outline-none cursor-pointer group ${
            isCategoriesActive
              ? "text-white bg-neutral-950 shadow-xs"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <span>الأقسام</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70 group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" sideOffset={8} className="w-60 p-1.5 rounded-2xl shadow-xl border border-neutral-200/90 bg-white z-50">
          <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            أقسام وتصنيفات المتجر
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {allCategories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <DropdownMenuItem key={cat.slug} asChild>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-amber-50 text-amber-900 font-bold"
                      : "text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {typeof cat.productsCount === "number" && cat.productsCount > 0 ? (
                    <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 px-1.5 py-0.5 rounded-full">
                      {cat.productsCount}
                    </span>
                  ) : null}
                </Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/products"
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 cursor-pointer"
            >
              <span>تصفح الكتالوج بالكامل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 5. العروض 🔥 */}
      <Link
        href="/products?onSale=true"
        aria-current={onSale ? "page" : undefined}
        className={`px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
          onSale
            ? "text-white bg-rose-600 shadow-xs shadow-rose-200"
            : "text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/70 shadow-2xs"
        }`}
      >
        العروض 🔥
      </Link>
    </nav>
  );
}

export function NavbarLinks({ categories }: NavbarLinksProps) {
  return (
    <Suspense fallback={<nav className="h-8" />}>
      <NavbarLinksInner categories={categories} />
    </Suspense>
  );
}

