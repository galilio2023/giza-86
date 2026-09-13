"use client";

import { useAdminTableParams } from "@/hooks/useAdminTableParams";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { ProductItem, CategoryItem } from "@/types";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  ProductFilterBar,
  ProductTable,
  ProductFormModal,
} from "./products";

interface AdminProductsClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
}

export function AdminProductsClient({
  initialProducts,
  categories,
  totalCount,
  currentPage = 1,
  pageSize = 20,
}: AdminProductsClientProps) {
  const {
    items: products,
    modalOpen,
    editingItem: editingProduct,
    openCreateModal,
    openEditModal,
    closeModal,
    deletingItem: deletingProduct,
    setDeletingItem: setDeletingProduct,
    isDeleting,
    handleConfirmDelete,
    handleItemSaved,
  } = useAdminCrud<ProductItem>({
    initialItems: initialProducts,
    apiEndpoint: "/api/products",
    resourceName: "المنتج",
    getItemDisplayName: (p) => p.name,
  });

  const {
    searchQuery,
    setSearchQuery,
    activeFilter: categoryFilter,
    handleFilterChange: handleCategoryChange,
    handlePageChange,
  } = useAdminTableParams({
    baseUrl: "/admin/products",
    defaultFilter: "all",
    filterParamName: "category",
  });

  const total = totalCount ?? products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <ProductFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        onAddNew={openCreateModal}
      />

      <ProductTable
        products={products}
        onEdit={openEditModal}
        onDelete={(id, name) => {
          const prod = products.find((p) => p.id === id) || ({ id, name } as ProductItem);
          setDeletingProduct(prod);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={total}
        onPageChange={handlePageChange}
      />

      <ProductFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingProduct={editingProduct}
        categories={categories}
        onSaveSuccess={handleItemSaved}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title="حذف المنتج من المتجر"
        description={`هل أنت متأكد من رغبتك في حذف المنتج "${deletingProduct?.name}"؟ سيتم حذف كافة المقاسات والألوان المرتبطة به نهائياً.`}
        confirmText="نعم، احذف المنتج"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
