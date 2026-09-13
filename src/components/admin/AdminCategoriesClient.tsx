"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { api } from "@/lib/api-client";
import { CategoryGrid, CategoryFormModal } from "./categories";

interface AdminCategoriesClientProps {
  initialCategories: CategoryItem[];
}

export function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
  const [loading, setLoading] = useState(false);

  const {
    items: categories,
    modalOpen,
    setModalOpen,
    editingItem: editingCategory,
    openCreateModal,
    openEditModal,
    deletingItem: deletingCategory,
    setDeletingItem: setDeletingCategory,
    isDeleting,
    handleConfirmDelete,
    handleItemSaved,
  } = useAdminCrud<CategoryItem>({
    initialItems: initialCategories,
    apiEndpoint: "/api/categories",
    resourceName: "القسم",
    getItemDisplayName: (cat) => cat.name,
  });

  const handleSaveCategory = async (payload: {
    name: string;
    slug: string;
    description?: string;
    image: string;
    displayOrder: number;
  }) => {
    setLoading(true);
    try {
      if (editingCategory) {
        const updated = await api.categories.update(editingCategory.id, payload);
        toast.success("تم تحديث بيانات القسم بنجاح في قاعدة البيانات");
        handleItemSaved(updated, true);
      } else {
        const newCat = await api.categories.create(payload);
        toast.success("تمت إضافة القسم الجديد بنجاح في قاعدة البيانات");
        handleItemSaved(newCat, false);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء حفظ القسم"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            أقسام وتصنيفات المتجر
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            إدارة وتعديل وتصنيف المنتجات لسهولة تصفح العملاء
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>إضافة قسم جديد</span>
        </Button>
      </div>

      <CategoryGrid
        categories={categories}
        onEdit={openEditModal}
        onDelete={setDeletingCategory}
      />

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingCategory={editingCategory}
        totalCategories={categories.length}
        onSave={handleSaveCategory}
        loading={loading}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        title="حذف القسم"
        description={`هل أنت متأكد من رغبتك في حذف قسم "${deletingCategory?.name}"؟ سيتم إلغاء تصنيف المنتجات التابعة له.`}
        confirmText="نعم، احذف القسم"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
