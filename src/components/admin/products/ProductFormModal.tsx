"use client";

import { useState, useEffect } from "react";
import { ProductItem, CategoryItem } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductVariantsForm } from "@/hooks/useProductVariantsForm";
import { ProductColorManager } from "./ProductColorManager";
import { ProductGalleryManager } from "./ProductGalleryManager";
import { ProductVariantMatrix } from "./ProductVariantMatrix";
import { ProductGeneralInfo } from "./ProductGeneralInfo";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: ProductItem | null;
  categories: CategoryItem[];
  onSaveSuccess: (product: ProductItem, isEdit: boolean) => void;
}

function ProductFormContent({
  editingProduct,
  categories,
  onSaveSuccess,
  onClose,
}: Omit<ProductFormModalProps, "isOpen">) {
  const initialSku = editingProduct
    ? editingProduct.sku || `SKU-${editingProduct.id}`
    : "SKU-NEW";

  const [name, setName] = useState(editingProduct?.name || "");
  const [slug, setSlug] = useState(editingProduct?.slug || "");
  const [sku, setSku] = useState(initialSku);
  const [description, setDescription] = useState(editingProduct?.description || "");
  const [fabricDetails, setFabricDetails] = useState(
    editingProduct ? editingProduct.fabricDetails || "" : ""
  );
  const [badgeText, setBadgeText] = useState(editingProduct?.badgeText || "");
  const [hasSizeGuide, setHasSizeGuide] = useState(
    editingProduct ? (editingProduct.hasSizeGuide ?? true) : true
  );
  const [price, setPrice] = useState(editingProduct ? String(editingProduct.price) : "");
  const [salePrice, setSalePrice] = useState(
    editingProduct?.salePrice ? String(editingProduct.salePrice) : ""
  );
  const [categoryId, setCategoryId] = useState<number>(
    editingProduct?.categoryId || categories[0]?.id || 1
  );
  const [images, setImages] = useState<string[]>(
    editingProduct?.images && editingProduct.images.length > 0
      ? editingProduct.images
      : []
  );
  const [isFeatured, setIsFeatured] = useState(Boolean(editingProduct?.isFeatured));
  const [isNew, setIsNew] = useState(editingProduct ? Boolean(editingProduct.isNew) : true);
  const [saving, setSaving] = useState(false);

  const {
    selectedSizes,
    customSizes,
    colors,
    variants,
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
  } = useProductVariantsForm();

  const handlePresetSelection = (preset: "apparel" | "pants" | "one-size") => {
    handleApplySizePreset(preset, sku);
    if (preset === "one-size") {
      setHasSizeGuide(false);
      if (!badgeText) setBadgeText("إكسسوار حصري ✨");
    } else {
      setHasSizeGuide(true);
      if (badgeText === "إكسسوار حصري ✨") setBadgeText("قطن مصري فاخر 🇪🇬");
    }
  };

  // Initialize variants on mount cleanly without render-time side effects
  useEffect(() => {
    if (editingProduct) {
      initVariants(
        initialSku,
        editingProduct.sizes,
        editingProduct.colors,
        editingProduct.variants
      );
    } else {
      initVariants(
        "SKU-NEW",
        ["S", "M", "L", "XL", "2XL"],
        [
          { name: "أسود", hex: "#111827" },
          { name: "أوف وايت", hex: "#f3f4f6" },
        ]
      );
    }
  }, [editingProduct, initVariants, initialSku]);

  const handleImageRemoved = (removedUrl: string) => {
    handleColorsChange(
      colors.map((c) => (c.imageUrl === removedUrl ? { ...c, imageUrl: undefined } : c)),
      sku
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price || isNaN(Number(price))) {
      toast.error("يرجى إدخال اسم المنتج وسعره بشكل صحيح");
      return;
    }

    if (images.length === 0) {
      toast.error("يرجى إضافة صورة واحدة على الأقل للمنتج");
      return;
    }

    if (variants.length === 0) {
      toast.error("يرجى اختيار مقاس ولون واحد على الأقل للمنتج");
      return;
    }

    setSaving(true);
    const cat = categories.find((c) => c.id === categoryId);
    const calculatedTotalStock = variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);

    const productPayload = {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      sku: sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      description: description.trim() || name.trim(),
      fabricDetails: fabricDetails.trim() || undefined,
      badgeText: badgeText.trim() || undefined,
      hasSizeGuide,
      price: Number(price),
      salePrice: salePrice && !isNaN(Number(salePrice)) ? Number(salePrice) : undefined,
      stock: calculatedTotalStock,
      categoryId,
      categoryName: cat?.name || "ملابس كاجوال",
      sizes: selectedSizes.length > 0 ? selectedSizes : ["مقاس موحد"],
      colors,
      images,
      variants,
      isFeatured,
      isNew,
    };

    try {
      if (editingProduct) {
        const updated = await api.products.update(editingProduct.id, productPayload);
        toast.success(`تم تحديث بيانات المنتج "${updated.name}" بنجاح في قاعدة البيانات`);
        onSaveSuccess(updated, true);
      } else {
        const created = await api.products.create(productPayload);
        toast.success(`تمت إضافة المنتج الجديد "${created.name}" بنجاح في قاعدة البيانات`);
        onSaveSuccess(created, false);
      }
      onClose();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "حدث خطأ غير متوقع أثناء حفظ المنتج"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
      {/* General Product Metadata */}
      <ProductGeneralInfo
        name={name}
        onNameChange={setName}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        slug={slug}
        onSlugChange={setSlug}
        sku={sku}
        onSkuChange={setSku}
        description={description}
        onDescriptionChange={setDescription}
        fabricDetails={fabricDetails}
        onFabricDetailsChange={setFabricDetails}
        badgeText={badgeText}
        onBadgeTextChange={setBadgeText}
        price={price}
        onPriceChange={setPrice}
        salePrice={salePrice}
        onSalePriceChange={setSalePrice}
        totalStock={totalStock}
        selectedSizes={selectedSizes}
        customSizes={customSizes}
        onToggleSize={(s) => handleToggleSize(s, sku)}
        onApplySizePreset={handlePresetSelection}
        onAddCustomSize={(cs) => handleAddCustomSize(cs, sku)}
        isFeatured={isFeatured}
        onToggleFeatured={setIsFeatured}
        isNew={isNew}
        onToggleNew={setIsNew}
        hasSizeGuide={hasSizeGuide}
        onToggleSizeGuide={setHasSizeGuide}
      />

      {/* Colors Selection with Image Sync */}
      <ProductColorManager
        colors={colors}
        onChange={(newColors) => handleColorsChange(newColors, sku)}
        availableImages={images}
      />

      {/* Multi-Image Gallery Manager with File Upload */}
      <ProductGalleryManager
        images={images}
        onChange={setImages}
        onImageRemoved={handleImageRemoved}
      />

      {/* Variant Inventory Matrix Table */}
      <ProductVariantMatrix
        variants={variants}
        bulkStock={bulkStock}
        onBulkStockChange={setBulkStock}
        onApplyBulkStock={handleApplyBulkStock}
        onVariantStockChange={handleVariantStockChange}
        onVariantSkuChange={handleVariantSkuChange}
      />

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-8 -mb-4 sm:-mb-8 p-4 sm:p-6 bg-white/95 backdrop-blur-xs border-t border-neutral-200 flex justify-end gap-3 z-20 shadow-md mt-6 rounded-b-3xl">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={saving}
          className="min-h-[40px] px-4"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={saving}
          className="min-h-[40px] px-5"
        >
          {saving ? "جاري الحفظ..." : editingProduct ? "تحديث المنتج" : "حفظ وإضافة للمتجر"}
        </Button>
      </div>
    </form>
  );
}

export function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onSaveSuccess,
}: ProductFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:w-full max-w-4xl p-4 sm:p-8 rounded-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3 mb-4">
          <DialogTitle className="text-lg font-black text-neutral-900">
            {editingProduct ? `تعديل بيانات المنتج (${editingProduct.name})` : "إضافة منتج جديد للمتجر"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <ProductFormContent
            key={editingProduct ? `edit-${editingProduct.id}` : "create"}
            editingProduct={editingProduct}
            categories={categories}
            onSaveSuccess={onSaveSuccess}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
