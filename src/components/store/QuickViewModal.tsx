"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";
import { ProductItem } from "@/types";
import { formatEGP } from "@/lib/utils";
import { useProductVariantSelection } from "@/hooks/useProductVariantSelection";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductVariantSelector } from "@/components/store/product/ProductVariantSelector";

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export function QuickViewModal({ product, onClose, whatsappNumber }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const {
    selectedSize,
    setSelectedSize,
    selectedColor,
    handleColorSelect,
    quantity,
    setQuantity,
    currentPrice,
    isOutOfStock,
    addToCart,
    getWhatsAppUrl,
  } = useProductVariantSelection({
    product,
    onAddedToCart: onClose,
  });

  useScrollLock(!!product);

  if (!product) return null;

  const handleWhatsAppOrder = () => {
    const url = getWhatsAppUrl(whatsappNumber);
    if (url) window.open(url, "_blank");
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl border border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Gallery */}
          <div className="p-6 bg-neutral-50 flex flex-col items-center justify-center">
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-200/80">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto w-full pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? "border-amber-600 scale-105" : "border-transparent opacity-70"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Badge variant="warning">
                  {product.badgeText || product.categoryName || "منتج أصلي"}
                </Badge>
                <DialogTitle className="text-xl font-black text-neutral-900 leading-snug pt-1">
                  {product.name}
                </DialogTitle>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-900">
                  {formatEGP(currentPrice)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      {formatEGP(product.price)}
                    </span>
                    <Badge variant="destructive">
                      وفر {formatEGP(product.price - product.salePrice)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Egyptian Fabric Specs */}
              {product.fabricDetails && (
                <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200/70 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-800">مواصفات الخامة: </span>
                    {product.fabricDetails}
                  </div>
                </div>
              )}

              {/* Reusable Product Variant Selection */}
              <ProductVariantSelector
                product={product}
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                quantity={quantity}
                onQuantityChange={setQuantity}
                isOutOfStock={isOutOfStock}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={() => addToCart()}
                className={`gap-2 ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>
                  {isOutOfStock ? "نفد من المخزون" : `إضافة إلى السلة (${formatEGP(currentPrice * quantity)})`}
                </span>
              </Button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2.5 bg-neutral-950 hover:bg-neutral-900 text-white border border-[#c59b27]/80 hover:border-amber-400 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md shadow-black/20 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer group active:scale-[0.99]"
              >
                <WhatsAppIcon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="group-hover:text-amber-300 transition-colors">اطلب سريعاً عبر واتساب مع المبيعات</span>
              </button>

              <Link
                href={`/products/${product.slug || product.id}`}
                onClick={onClose}
                className="w-full text-center text-xs font-bold text-neutral-600 hover:text-amber-800 py-1 transition flex items-center justify-center gap-1.5 group"
              >
                <span>عرض تفاصيل ومواصفات المنتج بالكامل</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
