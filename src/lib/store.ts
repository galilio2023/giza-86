import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, ProductItem, ProductColor } from "@/types";
import { findMatchingVariant, getEffectivePrice } from "@/lib/domain/variants";
import { useWishlistStore } from "./wishlist-store";

export { useWishlistStore };

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: ProductItem, size: string, color: ProductColor, quantity?: number, variantId?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, size, color, quantity = 1, variantId) => {
        const effectiveVariant = variantId
          ? product.variants?.find((v) => v.id === variantId)
          : findMatchingVariant(product.variants, size, color.name);

        const effectiveVariantId = effectiveVariant?.id ?? variantId;
        const effectivePrice = getEffectivePrice(product, effectiveVariant);
        const hasCustomVariantPrice =
          effectiveVariant?.price !== undefined &&
          effectiveVariant?.price !== null &&
          !isNaN(Number(effectiveVariant.price));

        const effectiveSalePrice = hasCustomVariantPrice
          ? undefined
          : product.salePrice;

        const id = `${product.id}-${size}-${color.hex}`;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantity;
          if (effectiveVariantId && !updated[existingIndex].variantId) {
            updated[existingIndex].variantId = effectiveVariantId;
          }
          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            id,
            productId: product.id,
            variantId: effectiveVariantId,
            name: product.name,
            price: effectivePrice,
            salePrice: effectiveSalePrice,
            selectedSize: size,
            selectedColor: color,
            image: color.imageUrl || product.images[0] || "",
            quantity,
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.salePrice || item.price;
          return acc + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "giza86-cart-storage",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => () => {
        if (typeof window !== "undefined") {
          try {
            const legacy = localStorage.getItem("nile-threads-cart-storage");
            if (legacy && !localStorage.getItem("giza86-cart-storage")) {
              localStorage.setItem("giza86-cart-storage", legacy);
            }
          } catch {
            // Ignore localStorage read errors
          }
        }
      },
    }
  )
);
