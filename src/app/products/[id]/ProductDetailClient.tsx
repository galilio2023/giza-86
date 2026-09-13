"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductItem, StoreSettingsItem, ProductColor } from "@/types";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useProductVariantSelection } from "@/hooks/useProductVariantSelection";
import { toast } from "sonner";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import {
  ProductGallery,
  ProductInfo,
  ProductVariantSelector,
  ProductActionButtons,
  ProductDescriptionSection,
  ProductMobileStickyBar,
  ProductSizeGuideModal,
} from "@/components/store/product";

interface Props {
  product: ProductItem;
  relatedProductsSlot?: React.ReactNode;
  settings?: Partial<StoreSettingsItem>;
}

export function ProductDetailClient({ product, relatedProductsSlot, settings }: Props) {
  const brandName = settings?.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const {
    selectedSize,
    setSelectedSize,
    selectedColor,
    handleColorSelect,
    activeColorImage,
    setActiveColorImage,
    quantity,
    setQuantity,
    currentPrice,
    isOutOfStock,
    isAdded,
    addToCart,
    getWhatsAppUrl,
  } = useProductVariantSelection({
    product,
    addedFeedbackDuration: 2200,
  });

  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleColorSelection = (c: ProductColor) => {
    handleColorSelect(c);
    if (c.imageUrl) {
      const foundIdx = product.images.indexOf(c.imageUrl);
      if (foundIdx !== -1) setSelectedImage(foundIdx);
    }
  };

  const handleAddToCart = () => {
    addToCart();
  };

  const handleWhatsAppOrder = () => {
    const url = getWhatsAppUrl(settings?.whatsapp);
    if (url) window.open(url, "_blank");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط المنتج إلى الحافظة!");
    }
  };

  return (
    <>
      <div className="layout-container pt-8 pb-28 sm:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-neutral-900">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900">
            المتجر
          </Link>
          <span>/</span>
          {product.categoryName && (
            <>
              <Link
                href={`/products?category=${product.categorySlug || product.categoryId}`}
                className="hover:text-neutral-900"
              >
                {product.categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-neutral-900 font-bold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Showcase: Gallery + Buying Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          {/* Gallery Column */}
          <div className="md:col-span-6 lg:col-span-7">
            <ProductGallery
              product={product}
              selectedImage={selectedImage}
              activeColorImage={activeColorImage}
              onSelectImage={setSelectedImage}
              onResetColorImage={() => setActiveColorImage(null)}
              isInWishlist={isInWishlist}
              onToggleWishlist={() => {
                toggleWishlist(product.id);
                toast.success(
                  isInWishlist ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة"
                );
              }}
            />
          </div>

          {/* Purchasing Form Column */}
          <div className="md:col-span-6 lg:col-span-5 space-y-6">
            <ProductInfo
              product={product}
              brandName={brandName}
              onShare={handleShare}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
            />

            <ProductVariantSelector
              product={product}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelection}
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
              quantity={quantity}
              onQuantityChange={setQuantity}
              isOutOfStock={isOutOfStock}
            />

            <ProductActionButtons
              product={product}
              currentPrice={currentPrice}
              quantity={quantity}
              isOutOfStock={isOutOfStock}
              isAdded={isAdded}
              onAddToCart={handleAddToCart}
              onWhatsAppOrder={handleWhatsAppOrder}
            />
          </div>
        </div>

        {/* Product Long Description Section */}
        <ProductDescriptionSection product={product} brandName={brandName} />

        {/* Interleaved Server Component Slot for Related Products */}
        {relatedProductsSlot}
      </div>

      {/* Mobile Sticky Buy Action Bar */}
      <ProductMobileStickyBar
        currentPrice={currentPrice}
        quantity={quantity}
        selectedSize={selectedSize}
        isOutOfStock={isOutOfStock}
        isAdded={isAdded}
        onAddToCart={handleAddToCart}
        onWhatsAppOrder={handleWhatsAppOrder}
      />

      {/* Size Guide Accessible Dialog */}
      {product.hasSizeGuide !== false && (
        <ProductSizeGuideModal
          open={sizeGuideOpen}
          onOpenChange={setSizeGuideOpen}
        />
      )}
    </>
  );
}
