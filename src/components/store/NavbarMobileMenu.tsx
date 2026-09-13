"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

interface NavLinkItem {
  label: string;
  href: string;
  highlight?: boolean;
}

interface NavbarMobileMenuProps {
  navLinks: NavLinkItem[];
}

export function NavbarMobileMenu({ navLinks }: NavbarMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
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
          <div className="lg:hidden absolute top-full inset-x-0 z-50 border-b border-neutral-200 bg-white/98 backdrop-blur-md px-5 pt-4 pb-6 space-y-4 shadow-2xl max-h-[calc(100dvh-5.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
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
                placeholder="ابحث عن الملابس والمقاسات..."
                className="w-full pr-10 pl-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </form>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-base ${
                      link.highlight
                        ? "text-rose-600 font-bold bg-rose-50/70"
                        : isActive
                        ? "text-neutral-950 bg-neutral-100 font-bold"
                        : "text-neutral-800 hover:bg-neutral-100 font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
