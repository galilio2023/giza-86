"use client";

import { useState, useCallback } from "react";
import { ProductColor, ProductVariantItem } from "@/types";
import { toast } from "sonner";

export const APPAREL_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
export const PANTS_SIZES = ["30", "32", "34", "36", "48", "50", "52"];
export const ACCESSORY_SIZES = ["مقاس موحد", "One Size"];
export const AVAILABLE_SIZES = ["مقاس موحد", "One Size", ...APPAREL_SIZES, ...PANTS_SIZES];
export const DEFAULT_VARIANT_STOCK = 10;

export function generateDefaultVariants(
  baseSku: string,
  sizes: string[],
  colors: ProductColor[],
  existingVariants: ProductVariantItem[] = [],
  defaultStock: number = DEFAULT_VARIANT_STOCK
): ProductVariantItem[] {
  const result: ProductVariantItem[] = [];
  const existingMap = new Map<string, ProductVariantItem>();

  for (const v of existingVariants) {
    existingMap.set(`${v.size}:::${v.colorName}`, v);
  }

  for (const c of colors) {
    for (const s of sizes) {
      const key = `${s}:::${c.name}`;
      const existing = existingMap.get(key);
      if (existing) {
        result.push({
          ...existing,
          colorHex: c.hex,
        });
      } else {
        const cleanSku = (baseSku || "SKU").trim().toUpperCase();
        result.push({
          sku: `${cleanSku}-${s}-${c.name}`.replace(/\s+/g, ""),
          size: s,
          colorName: c.name,
          colorHex: c.hex,
          stock: defaultStock,
        });
      }
    }
  }
  return result;
}

export function useProductVariantsForm() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL", "2XL"]);
  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([
    { name: "أسود", hex: "#111827" },
    { name: "أبيض", hex: "#ffffff" },
  ]);
  const [variants, setVariants] = useState<ProductVariantItem[]>([]);
  const [bulkStock, setBulkStock] = useState(String(DEFAULT_VARIANT_STOCK));

  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  const initVariants = useCallback(
    (baseSku: string, initialSizes: string[], initialColors: ProductColor[], initialVariants: ProductVariantItem[] = []) => {
      setSelectedSizes(initialSizes);
      const customOnes = initialSizes.filter((s) => !AVAILABLE_SIZES.includes(s));
      if (customOnes.length > 0) {
        setCustomSizes((prev) => Array.from(new Set([...prev, ...customOnes])));
      }
      setColors(initialColors);
      const generated = generateDefaultVariants(baseSku, initialSizes, initialColors, initialVariants, DEFAULT_VARIANT_STOCK);
      setVariants(initialVariants.length > 0 ? initialVariants : generated);
    },
    []
  );

  const handleToggleSize = useCallback(
    (size: string, baseSku: string) => {
      setSelectedSizes((prevSizes) => {
        const nextSizes = prevSizes.includes(size)
          ? prevSizes.filter((s) => s !== size)
          : [...prevSizes, size];

        setVariants((prevVariants) =>
          generateDefaultVariants(baseSku, nextSizes, colors, prevVariants, DEFAULT_VARIANT_STOCK)
        );
        return nextSizes;
      });
    },
    [colors]
  );

  const handleApplySizePreset = useCallback(
    (preset: "apparel" | "pants" | "one-size", baseSku: string) => {
      let nextSizes: string[] = [];
      if (preset === "apparel") nextSizes = ["S", "M", "L", "XL", "2XL"];
      else if (preset === "pants") nextSizes = ["30", "32", "34", "36"];
      else if (preset === "one-size") nextSizes = ["مقاس موحد"];

      setSelectedSizes(nextSizes);
      setVariants((prevVariants) =>
        generateDefaultVariants(baseSku, nextSizes, colors, prevVariants, DEFAULT_VARIANT_STOCK)
      );
    },
    [colors]
  );

  const handleAddCustomSize = useCallback(
    (customSize: string, baseSku: string) => {
      const trimmed = customSize.trim();
      if (!trimmed) return;
      setCustomSizes((prev) => Array.from(new Set([...prev, trimmed])));
      setSelectedSizes((prev) => {
        if (prev.includes(trimmed)) return prev;
        const nextSizes = [...prev, trimmed];
        setVariants((prevVariants) =>
          generateDefaultVariants(baseSku, nextSizes, colors, prevVariants, DEFAULT_VARIANT_STOCK)
        );
        return nextSizes;
      });
    },
    [colors]
  );

  const handleColorsChange = useCallback(
    (newColors: ProductColor[], baseSku: string) => {
      setColors(newColors);
      setVariants((prevVariants) =>
        generateDefaultVariants(baseSku, selectedSizes, newColors, prevVariants, DEFAULT_VARIANT_STOCK)
      );
    },
    [selectedSizes]
  );

  const handleVariantStockChange = useCallback((index: number, newStock: number) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], stock: Math.max(0, newStock) };
      return next;
    });
  }, []);

  const handleVariantSkuChange = useCallback((index: number, newSku: string) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], sku: newSku };
      return next;
    });
  }, []);

  const handleApplyBulkStock = useCallback(() => {
    const val = Number(bulkStock);
    if (isNaN(val) || val < 0) {
      toast.error("يرجى إدخال رقم كمية صالح");
      return;
    }
    setVariants((prev) => prev.map((v) => ({ ...v, stock: val })));
    toast.success(`تم تعيين المخزون (${val} قطعة) لجميع المتغيرات بنجاح`);
  }, [bulkStock]);

  return {
    selectedSizes,
    setSelectedSizes,
    customSizes,
    colors,
    setColors,
    variants,
    setVariants,
    bulkStock,
    setBulkStock,
    totalStock,
    initVariants,
    handleToggleSize,
    handleApplySizePreset,
    handleAddCustomSize,
    handleColorsChange,
    handleVariantStockChange,
    handleVariantSkuChange,
    handleApplyBulkStock,
  };
}
