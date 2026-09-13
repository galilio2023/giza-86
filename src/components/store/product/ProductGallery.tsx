"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { ProductItem } from "@/types";

interface ProductGalleryProps {
  product: ProductItem;
  selectedImage: number;
  activeColorImage: string | null;
  onSelectImage: (index: number) => void;
  onResetColorImage: () => void;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
}

export function ProductGallery({
  product,
  selectedImage,
  activeColorImage,
  onSelectImage,
  onResetColorImage,
  isInWishlist,
  onToggleWishlist,
}: ProductGalleryProps) {
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="space-y-4">
      <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
        <Image
          src={activeColorImage || product.images[selectedImage] || product.images[0] || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 55vw"
          className="object-cover transition-all duration-500"
        />

        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
            خصم {Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
          </div>
        )}

        <button
          type="button"
          onClick={onToggleWishlist}
          className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md transition shadow-xs cursor-pointer ${
            isInWishlist
              ? "bg-rose-50 text-rose-600"
              : "bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white"
          }`}
          aria-label="المفضلة"
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? "fill-rose-600" : ""}`} />
        </button>
      </div>

      {/* Gallery Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectImage(idx);
                onResetColorImage();
              }}
              className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${
                (activeColorImage ? activeColorImage === img : selectedImage === idx)
                  ? "border-amber-600 ring-2 ring-amber-600/30 scale-102"
                  : "border-neutral-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
