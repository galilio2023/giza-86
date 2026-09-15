"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Search, ChevronDown, Sparkles, Tag, Shirt, Home } from "lucide-react";
import { CategoryItem } from "@/types";

interface NavbarMobileMenuProps {
  categories?: CategoryItem[];
}

function NavbarMobileMenuInner({ categories = [] }: NavbarMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const onSale = searchParams.get("onSale") === "true";
  const isAllProductsActive = pathname === "/products" && !currentCategory && !onSale;
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const toggleParent = (parentId: number) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Separate parent and standalone categories
  const parentCategories = categories.filter((c) => !c.parentId || c.parentId === null);

  return (
    <>
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-xl text-neutral-800 hover:bg-neutral-100 focus:outline-none transition cursor-pointer"
          aria-label="القائمة"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs animate-in fade-in-0 duration-200"
          />
          <div className="lg:hidden absolute top-full inset-x-0 z-50 border-b border-neutral-200 bg-white/98 backdrop-blur-md px-5 pt-4 pb-8 space-y-5 shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-900 transition z-10"
                aria-label="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الملابس، المقاسات، والستايلات..."
                className="w-full pr-10 pl-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </form>

            {/* Core Direct Navigation */}
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname === "/" ? "bg-neutral-950 text-white" : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <Home className="w-4 h-4 text-amber-500" />
                <span>الرئيسية</span>
              </Link>

              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                  isAllProductsActive ? "bg-neutral-950 text-white" : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <Shirt className="w-4 h-4 text-amber-500" />
                <span>جميع الموديلات</span>
              </Link>

              <Link
                href="/products?onSale=true"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/60 transition"
              >
                <Tag className="w-4 h-4 text-rose-500" />
                <span>العروض والتخفيضات 🔥</span>
              </Link>
            </div>

            {/* Category Hierarchy Section */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  أقسام وتصنيفات المتجر
                </span>
                <span className="text-[10px] text-neutral-400 font-bold">
                  {categories.length} قسم
                </span>
              </div>

              <div className="space-y-1.5">
                {parentCategories.map((parent) => {
                  const hasChildren = Boolean(parent.children && parent.children.length > 0);
                  const isExpanded = Boolean(expandedParents[parent.id]);

                  if (!hasChildren) {
                    return (
                      <Link
                        key={parent.id}
                        href={`/products?category=${parent.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-100 transition"
                      >
                        <span>{parent.name}</span>
                        {parent.productsCount ? (
                          <span className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-bold">
                            {parent.productsCount}
                          </span>
                        ) : null}
                      </Link>
                    );
                  }

                  return (
                    <div key={parent.id} className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 overflow-hidden">
                      {/* Parent Header Row */}
                      <div className="flex items-center justify-between p-2.5">
                        <Link
                          href={`/products?category=${parent.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 text-sm font-black text-neutral-900 hover:text-amber-700 transition px-1"
                        >
                          {parent.name}
                          {parent.productsCount ? (
                            <span className="text-[10px] text-neutral-400 mr-2 font-normal">
                              ({parent.productsCount} موديل)
                            </span>
                          ) : null}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleParent(parent.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200/60 transition cursor-pointer"
                          aria-label={`تبديل عرض ${parent.name}`}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-amber-600" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Nested Subcategories Accordion Content */}
                      {isExpanded && (
                        <div className="bg-white px-3 py-2 space-y-1 border-t border-neutral-200/60 animate-in fade-in-0 duration-150">
                          <Link
                            href={`/products?category=${parent.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-50/60 hover:bg-amber-100/70 transition"
                          >
                            <span>تصفح كل {parent.name}</span>
                            <span className="text-[10px] opacity-70">←</span>
                          </Link>

                          {parent.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={`/products?category=${child.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition"
                            >
                              <span>↳ {child.name}</span>
                              {child.productsCount ? (
                                <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 px-1.5 py-0.5 rounded-full">
                                  {child.productsCount}
                                </span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function NavbarMobileMenu({ categories = [] }: NavbarMobileMenuProps) {
  return (
    <Suspense fallback={<div className="lg:hidden min-h-[44px] min-w-[44px]" />}>
      <NavbarMobileMenuInner categories={categories} />
    </Suspense>
  );
}

