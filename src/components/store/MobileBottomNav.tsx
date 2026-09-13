"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Shirt, ShoppingBag, Heart, Flame } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useMounted } from "@/hooks/useMounted";

function MobileBottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const cartCount = useCartStore((state) => state.getTotalCount());
  const openCart = useCartStore((state) => state.openCart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  // Hide on admin routes, checkout, or single product pages (which have their own dedicated action bar)
  const isProductDetailPage = pathname.startsWith("/products/") && pathname !== "/products";
  if (pathname.startsWith("/admin") || pathname === "/checkout" || isProductDetailPage) {
    return null;
  }

  const isOnSale = pathname === "/products" && searchParams.get("onSale") === "true";
  const isWishlist = pathname === "/products" && searchParams.get("wishlist") === "true";
  const isCatalog = pathname === "/products" && !isOnSale && !isWishlist;
  const isHome = pathname === "/";

  return (
    <nav
      aria-label="شريط التنقل السفلي للهواتف"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 mobile-nav-bar pb-safe print:hidden"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {/* Home */}
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          className={`flex flex-col items-center justify-center py-1 gap-1 transition select-none ${
            isHome ? "text-neutral-950 font-black" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-xs leading-none font-semibold">الرئيسية</span>
        </Link>

        {/* Catalog */}
        <Link
          href="/products"
          aria-current={isCatalog ? "page" : undefined}
          className={`flex flex-col items-center justify-center py-1 gap-1 transition select-none ${
            isCatalog ? "text-neutral-950 font-black" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Shirt className={`w-5 h-5 ${isCatalog ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-xs leading-none font-semibold">الموديلات</span>
        </Link>

        {/* Offers */}
        <Link
          href="/products?onSale=true"
          aria-current={isOnSale ? "page" : undefined}
          className={`flex flex-col items-center justify-center py-1 gap-1 transition select-none ${
            isOnSale ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-rose-600"
          }`}
        >
          <Flame className={`w-5 h-5 text-rose-500 ${isOnSale ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-xs leading-none font-bold text-rose-600">العروض 🔥</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/products?wishlist=true"
          aria-current={isWishlist ? "page" : undefined}
          className={`relative flex flex-col items-center justify-center py-1 gap-1 transition select-none ${
            isWishlist ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 stroke-2 ${isWishlist ? "fill-rose-600 text-rose-600" : ""}`} />
            {mounted && wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-xs leading-none font-semibold">المفضلة</span>
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 gap-1 transition select-none text-neutral-500 hover:text-neutral-900 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-neutral-950 text-white text-xs font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs leading-none font-semibold">السلة</span>
        </button>
      </div>
    </nav>
  );
}

export function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavInner />
    </Suspense>
  );
}
