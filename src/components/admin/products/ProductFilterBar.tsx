import { Plus } from "lucide-react";
import { CategoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminSearchInput } from "@/components/admin/ui";

interface ProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: CategoryItem[];
  onAddNew: () => void;
}

export function ProductFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onAddNew,
}: ProductFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            إدارة المنتجات والمخزون
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            إضافة وتعديل الموديلات، معرض الصور، أسعار الجنيه المصري، المقاسات والألوان
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onAddNew}
          className="gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>إضافة منتج جديد</span>
        </Button>
      </div>

      {/* Filter Row */}
      <Card variant="modern" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="ابحث باسم المنتج أو كود الـ SKU..."
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-500 whitespace-nowrap">القسم:</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full sm:w-auto bg-neutral-50 border border-neutral-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">كافة الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>
    </div>
  );
}
