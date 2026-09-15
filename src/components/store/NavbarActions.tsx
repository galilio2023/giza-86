"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, Search, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { formatEGP } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";

export function NavbarActions() {
  const router = useRouter();
  const mounted = useMounted();
  const cartCount = useCartStore((state) => state.getTotalCount());
  const cartSubtotal = useCartStore((state) => state.getSubtotal());
  const openCart = useCartStore((state) => state.openCart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Mobile Search Quick Trigger */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-700 hover:text-neutral-950 bg-neutral-100/70 hover:bg-neutral-100 rounded-xl border border-neutral-200/80 transition-all duration-200 active:scale-95 shadow-2xs group cursor-pointer"
          title={mobileSearchOpen ? "إغلاق البحث" : "بحث في المتجر"}
          aria-label={mobileSearchOpen ? "إغلاق البحث" : "بحث في المتجر"}
        >
          {mobileSearchOpen ? (
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
          ) : (
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2] group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Wishlist Button */}
        <Link
          href="/products?wishlist=true"
          className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-700 hover:text-rose-600 bg-neutral-100/70 hover:bg-neutral-100 rounded-xl border border-neutral-200/80 transition-all duration-200 active:scale-95 shadow-2xs group"
          title={mounted && wishlist.length > 0 ? `المفضلة (${wishlist.length} منتجات)` : "المفضلة"}
          aria-label={mounted && wishlist.length > 0 ? `المفضلة (${wishlist.length} منتجات)` : "المفضلة"}
        >
          <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2] group-hover:scale-110 transition-transform" />
          {mounted && wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={openCart}
          aria-label={mounted && cartCount > 0 ? `سلة المشتريات (${cartCount} قطع)` : "سلة المشتريات"}
          title={mounted && cartCount > 0 ? `سلة المشتريات (${cartCount} قطع - ${formatEGP(cartSubtotal)})` : "سلة المشتريات فارغة"}
          className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-neutral-950 hover:bg-neutral-900 text-white rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2] group-hover:scale-110 transition-transform" />
          {mounted && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-950 text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs border border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Slide-down Search Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 sm:top-16 bg-white/98 backdrop-blur-md border-b border-neutral-200 px-4 py-2.5 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleMobileSearch} className="relative flex items-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                autoFocus
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="ابحث عن الملابس، الموديل، المقاس..."
                className="w-full pr-9 pl-4 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={!mobileSearchQuery.trim()}
              className="px-3.5 py-2 bg-neutral-950 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition cursor-pointer flex-shrink-0"
            >
              بحث
            </button>
          </form>
        </div>
      )}
    </>
  );
}
