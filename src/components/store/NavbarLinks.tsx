"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ArrowLeft, Sparkles } from "lucide-react";
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
  { id: 1, name: "أوفر سايز وتي شيرتات", slug: "oversized-tshirts", image: "" },
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

  // Filter top-level parent categories
  const parentCategories = allCategories.filter((c) => !c.parentId || c.parentId === null);
  // Show up to 2 popular top-level categories directly on wide screens
  const quickCategories = parentCategories.slice(0, 2);

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

      {/* 3. Quick parent categories (shown on xl+ screens) */}
      {quickCategories.map((c) => {
        const isCatActive = pathname === "/products" && currentCategory === c.slug;
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
            {c.name}
          </Link>
        );
      })}

      {/* 4. الأقسام Dropdown Menu with Nested Hierarchy */}
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

        <DropdownMenuContent
          align="center"
          sideOffset={8}
          className="w-72 sm:w-80 p-2 rounded-2xl shadow-2xl border border-neutral-200/90 bg-white z-50 max-h-[82vh] overflow-y-auto"
        >
          <DropdownMenuLabel className="px-2.5 py-1 text-[11px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            أقسام وتصنيفات المتجر
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {parentCategories.map((parent, pIdx) => {
            const hasChildren = Boolean(parent.children && parent.children.length > 0);
            const isParentSelected = currentCategory === parent.slug;

            return (
              <div key={parent.slug} className="py-1">
                {/* Parent Category Header Link */}
                <DropdownMenuItem asChild>
                  <Link
                    href={`/products?category=${parent.slug}`}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-colors ${
                      isParentSelected
                        ? "bg-amber-50 text-amber-950"
                        : "text-neutral-950 hover:bg-neutral-100 hover:text-amber-700"
                    }`}
                  >
                    <span>{parent.name}</span>
                    {typeof parent.productsCount === "number" && parent.productsCount > 0 ? (
                      <span className="text-[10px] text-neutral-500 font-bold bg-neutral-100 px-1.5 py-0.5 rounded-full">
                        {parent.productsCount}
                      </span>
                    ) : null}
                  </Link>
                </DropdownMenuItem>

                {/* Subcategories (Indented) */}
                {hasChildren && (
                  <div className="mr-3 pr-2 border-r border-neutral-200/70 space-y-0.5 mt-0.5 mb-1">
                    {parent.children?.map((child) => {
                      const isChildSelected = currentCategory === child.slug;
                      return (
                        <DropdownMenuItem key={child.slug} asChild>
                          <Link
                            href={`/products?category=${child.slug}`}
                            className={`flex items-center justify-between w-full px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              isChildSelected
                                ? "bg-amber-100/70 text-amber-950 font-bold"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                            }`}
                          >
                            <span className="truncate">↳ {child.name}</span>
                            {typeof child.productsCount === "number" && child.productsCount > 0 ? (
                              <span className="text-[10px] text-neutral-400 font-medium">
                                ({child.productsCount})
                              </span>
                            ) : null}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                )}

                {pIdx < parentCategories.length - 1 && <DropdownMenuSeparator className="my-1" />}
              </div>
            );
          })}

          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem asChild>
            <Link
              href="/products"
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-black text-amber-700 hover:bg-amber-50 cursor-pointer transition-colors"
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
