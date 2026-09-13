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
  const [moving, setMoving] = useState(false);

  const {
    items: categories,
    setItems: setCategories,
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
    router,
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
        await api.categories.update(editingCategory.id, payload);
        toast.success("تم تحديث بيانات القسم بنجاح في قاعدة البيانات");
        // Refetch full categories list to capture any swapped order positions
        const updatedList = await api.categories.getAll();
        if (Array.isArray(updatedList)) {
          setCategories(updatedList);
        }
        setModalOpen(false);
        router.refresh();
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

  const handleMoveCategory = async (category: CategoryItem, direction: "up" | "down") => {
    const sorted = [...categories].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id
    );
    const currentIndex = sorted.findIndex((c) => c.id === category.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetCategory = sorted[targetIndex];
    setMoving(true);

    try {
      const targetOrder = targetCategory.displayOrder ?? targetIndex + 1;
      await api.categories.update(category.id, {
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description,
        displayOrder: targetOrder,
      });

      // Refetch full list to synchronize both swapped categories
      const updatedList = await api.categories.getAll();
      if (Array.isArray(updatedList)) {
        setCategories(updatedList);
      }
      toast.success(`تم تغيير ترتيب "${category.name}" بنجاح`);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "فشل في تحديث ترتيب القسم"));
    } finally {
      setMoving(false);
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
            إدارة وتعديل وترتيب الأقسام (تظهر أول 3 أقسام تلقائياً في شبكة اللوك بوك بالصفحة الرئيسية)
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
        onMove={handleMoveCategory}
        isMoving={moving}
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
