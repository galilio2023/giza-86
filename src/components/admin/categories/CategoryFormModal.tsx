"use client";

import { useState } from "react";
import { CategoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: CategoryItem | null;
  totalCategories: number;
  allCategories?: CategoryItem[];
  onSave: (payload: {
    name: string;
    slug: string;
    description?: string;
    image: string;
    displayOrder: number;
    parentId?: number | null;
  }) => Promise<void>;
  loading: boolean;
}

function CategoryFormContent({
  editingCategory,
  totalCategories,
  allCategories = [],
  onSave,
  loading,
  onClose,
}: Omit<CategoryFormModalProps, "isOpen">) {
  const [name, setName] = useState(editingCategory?.name || "");
  const [slug, setSlug] = useState(editingCategory?.slug || "");
  const [parentId, setParentId] = useState<number | null>(editingCategory?.parentId ?? null);
  const [description, setDescription] = useState(editingCategory?.description || "");
  const [imageUrl, setImageUrl] = useState(
    editingCategory?.image || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(editingCategory ? editingCategory.displayOrder || 0 : totalCategories + 1)
  );

  // Available parent categories: top-level categories, excluding current editing category
  const hasChildren = Boolean(editingCategory?.children && editingCategory.children.length > 0);
  const availableParents = allCategories.filter(
    (c) => (!c.parentId || c.parentId === null) && (!editingCategory || c.id !== editingCategory.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSave({
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || undefined,
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      displayOrder: Number(displayOrder) || 0,
      parentId: hasChildren ? null : parentId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
      <div>
        <label className="block font-bold text-neutral-800 mb-1">اسم القسم *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلاً: تيشيرتات أوفر سايز، هوديز شتوي..."
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm"
        />
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">القسم الرئيسي (Parent Category)</label>
        <select
          value={hasChildren || parentId === null ? "" : String(parentId)}
          onChange={(e) => setParentId(e.target.value === "" ? null : Number(e.target.value))}
          disabled={hasChildren}
          className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-base lg:text-sm font-bold text-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          <option value="">قسم رئيسي (بدون قسم أب - Top Level)</option>
          {!hasChildren &&
            availableParents.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        {hasChildren ? (
          <p className="text-[11px] text-amber-600 font-bold mt-1">
            لا يمكن تحويل هذا القسم إلى قسم فرعي لأنه يحتوي بالفعل على أقسام فرعية تابعة له ({editingCategory?.children?.length} أقسام). للحفاظ على هيكل التصنيف الثنائي، يجب أولاً نقل أو فك ارتباط الأقسام التابعة له.
          </p>
        ) : (
          <p className="text-[11px] text-neutral-500 mt-1">
            اختر قسماً رئيسياً لربط هذا القسم كقسم فرعي تحته، أو اتركه كقسم رئيسي مستقل.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-neutral-800 mb-1">الرابط المخصص (Slug)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="oversized-tees"
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-left text-base lg:text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">ترتيب الظهور</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">الوصف</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف مختصر للقسم..."
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-base lg:text-sm"
        />
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">رابط صورة القسم (URL)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full p-2.5 rounded-xl border border-neutral-200 text-left font-mono text-base lg:text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
        >
          {loading ? "جاري الحفظ..." : editingCategory ? "تحديث القسم" : "إضافة القسم"}
        </Button>
      </div>
    </form>
  );
}

export function CategoryFormModal({
  isOpen,
  onClose,
  editingCategory,
  totalCategories,
  allCategories = [],
  onSave,
  loading,
}: CategoryFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? `تعديل قسم: ${editingCategory.name}` : "إضافة قسم جديد"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <CategoryFormContent
            key={editingCategory ? `edit-${editingCategory.id}` : "create"}
            editingCategory={editingCategory}
            totalCategories={totalCategories}
            allCategories={allCategories}
            onSave={onSave}
            loading={loading}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
