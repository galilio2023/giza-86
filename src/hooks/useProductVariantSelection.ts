"use client";

import { useState, useCallback, useMemo } from "react";
import { ProductItem, ProductColor, ProductVariantItem } from "@/types";
import { useCartStore } from "@/lib/store";
import { findMatchingVariant, getEffectivePrice, getEffectiveStock } from "@/lib/domain/variants";
import { getDiscountPercentage } from "@/lib/domain/pricing";
import { buildProductWhatsAppOrderUrl, buildProductWhatsAppRestockUrl } from "@/lib/domain/whatsapp";
import { toast } from "sonner";

export interface UseProductVariantSelectionOptions {
  product: ProductItem | null | undefined;
  initialSize?: string;
  initialColor?: ProductColor;
  initialQuantity?: number;
  addedFeedbackDuration?: number;
  onAddedToCart?: (payload: { size: string; color: ProductColor; quantity: number }) => void;
}

export interface UseProductVariantSelectionReturn {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: ProductColor;
  setSelectedColor: (color: ProductColor) => void;
  handleColorSelect: (color: ProductColor) => void;
  activeColorImage: string | null;
  setActiveColorImage: (url: string | null) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  currentVariant: ProductVariantItem | undefined;
  currentStock: number;
  isOutOfStock: boolean;
  currentPrice: number;
  discountPercentage: number;
  hasDiscount: boolean;
  isAdded: boolean;
  addToCart: (overrideQty?: number) => boolean;
  getWhatsAppUrl: (whatsappPhone?: string, origin?: string) => string;
  getWhatsAppRestockUrl: (whatsappPhone?: string, origin?: string) => string;
}

const DEFAULT_COLOR: ProductColor = { name: "أسود", hex: "#000000" };

/** Manages product variant selection, stock-aware cart actions, and WhatsApp URLs. */
export function useProductVariantSelection({
  product,
  initialSize,
  initialColor,
  initialQuantity = 1,
  addedFeedbackDuration = 2000,
  onAddedToCart,
}: UseProductVariantSelectionOptions): UseProductVariantSelectionReturn {
  const defaultSize = initialSize || product?.sizes?.[0] || "L";
  const defaultColor = initialColor || product?.colors?.[0] || DEFAULT_COLOR;

  const [prevProductId, setPrevProductId] = useState<number | undefined>(product?.id);
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(defaultColor);
  const [activeColorImage, setActiveColorImage] = useState<string | null>(
    product?.colors?.[0]?.imageUrl || null
  );
  const [quantity, setQuantity] = useState<number>(Math.max(1, initialQuantity));
  const [isAdded, setIsAdded] = useState(false);

  // Safely sync state when product instance changes without cascading renders
  if (prevProductId !== product?.id) {
    setPrevProductId(product?.id);
    setSelectedSize(initialSize || product?.sizes?.[0] || "L");
    const fallbackColor = initialColor || product?.colors?.[0] || DEFAULT_COLOR;
    setSelectedColor(fallbackColor);
    setActiveColorImage(fallbackColor.imageUrl || null);
    setQuantity(Math.max(1, initialQuantity));
  }

  const addItem = useCartStore((state) => state.addItem);

  // Active variant resolution based on size & color name
  const currentVariant = useMemo(() => {
    if (!product) return undefined;
    return findMatchingVariant(product.variants, selectedSize, selectedColor.name);
  }, [product, selectedSize, selectedColor.name]);

  // Pricing & Stock resolution
  const currentStock = useMemo(() => {
    if (!product) return 0;
    return getEffectiveStock(product, currentVariant);
  }, [product, currentVariant]);

  const isOutOfStock = currentStock <= 0;

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    return getEffectivePrice(product, currentVariant);
  }, [product, currentVariant]);

  const discountPercentage = useMemo(() => {
    if (!product) return 0;
    return getDiscountPercentage(product.price, product.salePrice);
  }, [product]);

  const hasDiscount = discountPercentage > 0;

  const handleColorSelect = useCallback((color: ProductColor) => {
    setSelectedColor(color);
    if (color.imageUrl) {
      setActiveColorImage(color.imageUrl);
    }
  }, []);

  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.min(currentStock || 1, prev + 1));
  }, [currentStock]);

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const addToCart = useCallback(
    (overrideQty?: number): boolean => {
      if (!product) return false;

      if (isOutOfStock) {
        toast.error(
          `نعتذر، مقاس "${selectedSize}" ولون "${selectedColor.name}" من هذا المنتج غير متوفر بالمخزون حالياً`
        );
        return false;
      }

      const desiredQty = overrideQty ?? quantity;
      const safeQty = Math.min(currentStock, Math.max(1, desiredQty));

      addItem(product, selectedSize, selectedColor, safeQty, currentVariant?.id);

      setIsAdded(true);
      if (addedFeedbackDuration > 0) {
        setTimeout(() => setIsAdded(false), addedFeedbackDuration);
      }

      toast.success(`تمت إضافة "${product.name}" إلى السلة`, {
        description: `المقاس: ${selectedSize} | اللون: ${selectedColor.name} | الكمية: ${safeQty}`,
      });

      onAddedToCart?.({
        size: selectedSize,
        color: selectedColor,
        quantity: safeQty,
      });

      return true;
    },
    [
      product,
      isOutOfStock,
      selectedSize,
      selectedColor,
      quantity,
      currentStock,
      addItem,
      currentVariant?.id,
      addedFeedbackDuration,
      onAddedToCart,
    ]
  );

  const getWhatsAppRestockUrl = useCallback(
    (whatsappPhone?: string, origin?: string): string => {
      if (!product) return "";
      const baseOrigin =
        origin || (typeof window !== "undefined" ? window.location.origin : "");
      return buildProductWhatsAppRestockUrl({
        whatsappPhone,
        productName: product.name,
        productSlugOrId: product.slug || product.id,
        size: selectedSize,
        colorName: selectedColor.name,
        origin: baseOrigin,
      });
    },
    [product, selectedSize, selectedColor.name]
  );

  const getWhatsAppUrl = useCallback(
    (whatsappPhone?: string, origin?: string): string => {
      if (!product) return "";
      if (isOutOfStock) {
        return getWhatsAppRestockUrl(whatsappPhone, origin);
      }
      const baseOrigin =
        origin || (typeof window !== "undefined" ? window.location.origin : "");
      return buildProductWhatsAppOrderUrl({
        whatsappPhone,
        productName: product.name,
        productSlugOrId: product.slug || product.id,
        size: selectedSize,
        colorName: selectedColor.name,
        quantity,
        totalPrice: currentPrice * quantity,
        origin: baseOrigin,
      });
    },
    [product, isOutOfStock, getWhatsAppRestockUrl, selectedSize, selectedColor.name, quantity, currentPrice]
  );

  return {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    handleColorSelect,
    activeColorImage,
    setActiveColorImage,
    quantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    currentVariant,
    currentStock,
    isOutOfStock,
    currentPrice,
    discountPercentage,
    hasDiscount,
    isAdded,
    addToCart,
    getWhatsAppUrl,
    getWhatsAppRestockUrl,
  };
}
