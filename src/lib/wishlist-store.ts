import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (productId: number) => {
        const list = get().wishlist;
        if (list.includes(productId)) {
          set({ wishlist: list.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...list, productId] });
        }
      },

      isInWishlist: (productId: number) => {
        return get().wishlist.includes(productId);
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "giza86-wishlist-storage",
    }
  )
);
