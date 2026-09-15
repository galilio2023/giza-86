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

/** Persistent shopping cart store managing items, quantities, variant pricing, and drawer visibility. */
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

        const cleanSize = size.trim().toUpperCase();
        const cleanColor = color.name.trim().toLowerCase();
        const id = `${product.id}-${cleanSize}-${cleanColor}-${color.hex}`;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) =>
            item.id === id ||
            (item.productId === product.id &&
              item.selectedSize.trim().toUpperCase() === cleanSize &&
              (item.selectedColor.hex.toLowerCase() === color.hex.toLowerCase() ||
                item.selectedColor.name.trim().toLowerCase() === cleanColor))
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].id = id;
          updated[existingIndex].quantity += quantity;
          if (effectiveVariantId && !updated[existingIndex].variantId) {
            updated[existingIndex].variantId = effectiveVariantId;
          }
          if (!updated[existingIndex].slug && product.slug) {
            updated[existingIndex].slug = product.slug;
          }
          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            id,
            productId: product.id,
            slug: product.slug,
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
      onRehydrateStorage: () => (state) => {
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

        if (state && Array.isArray(state.items)) {
          const itemMap = new Map<string, CartItem>();
          for (const item of state.items) {
            const cleanSize = (item.selectedSize || "").trim().toUpperCase();
            const cleanColor = (item.selectedColor?.name || "").trim().toLowerCase();
            const hex = item.selectedColor?.hex || "";
            const normalizedId = `${item.productId}-${cleanSize}-${cleanColor}-${hex}`;
            const existing = itemMap.get(normalizedId);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              itemMap.set(normalizedId, { ...item, id: normalizedId });
            }
          }
          state.items = Array.from(itemMap.values());
        }
      },
    }
  )
);
