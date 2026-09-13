"use client";

import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { formatEGP } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";

export function NavbarActions() {
  const mounted = useMounted();
  const cartCount = useCartStore((state) => state.getTotalCount());
  const cartSubtotal = useCartStore((state) => state.getSubtotal());
  const openCart = useCartStore((state) => state.openCart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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
  );
}
