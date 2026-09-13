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
    editingProduct
      ? editingProduct.fabricDetails || ""
      : "قطن مصري 100% فاخر معالج ضد الانكماش والوبر"
  );
  const [price, setPrice] = useState(editingProduct ? String(editingProduct.price) : "");
  const [salePrice, setSalePrice] = useState(
    editingProduct?.salePrice ? String(editingProduct.salePrice) : ""
  );
  const [categoryId, setCategoryId] = useState<number>(
    editingProduct?.categoryId || categories[0]?.id || 1
  );
  const [images, setImages] = useState<string[]>(
    editingProduct
      ? editingProduct.images.length > 0
        ? editingProduct.images
        : ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"]
      : [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
        ]
  );
  const [isFeatured, setIsFeatured] = useState(Boolean(editingProduct?.isFeatured));
  const [isNew, setIsNew] = useState(editingProduct ? Boolean(editingProduct.isNew) : true);
  const [saving, setSaving] = useState(false);

  const {
    selectedSizes,
    colors,
    variants,
    bulkStock,
    setBulkStock,
    totalStock,
    initVariants,
    handleToggleSize,
    handleColorsChange,
    handleVariantStockChange,
    handleVariantSkuChange,
    handleApplyBulkStock,
  } = useProductVariantsForm();

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
      price: Number(price),
      salePrice: salePrice && !isNaN(Number(salePrice)) ? Number(salePrice) : undefined,
      stock: calculatedTotalStock,
      categoryId,
      categoryName: cat?.name || "ملابس كاجوال",
      sizes: selectedSizes.length > 0 ? selectedSizes : ["M", "L", "XL"],
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
        price={price}
        onPriceChange={setPrice}
        salePrice={salePrice}
        onSalePriceChange={setSalePrice}
        totalStock={totalStock}
        selectedSizes={selectedSizes}
        onToggleSize={(s) => handleToggleSize(s, sku)}
        isFeatured={isFeatured}
        onToggleFeatured={setIsFeatured}
        isNew={isNew}
        onToggleNew={setIsNew}
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={saving}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={saving}
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
      <DialogContent className="max-w-4xl p-6 sm:p-8 rounded-3xl max-h-[92vh] overflow-y-auto">
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
