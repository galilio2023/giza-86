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
  stockFilter: string;
  onStockChange: (value: string) => void;
  categories: CategoryItem[];
  onAddNew: () => void;
}

export function ProductFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  categories,
  onAddNew,
}: ProductFilterBarProps) {
  // Separate top-level parent departments and sub-categories
  const parentCats = categories.filter((c) => !c.parentId);
  const getSubcategories = (parentId: number) =>
    categories.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            إدارة المنتجات والمخزون
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            متابعة المخزون اللحظي، إضافة وتعديل الموديلات، الألوان، المقاسات، والأسعار
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
      <Card variant="modern" padding="md" className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <AdminSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="ابحث باسم المنتج أو كود الـ SKU..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Stock Filter Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <span className="text-xs text-neutral-500 font-bold whitespace-nowrap">المخزون:</span>
            <select
              value={stockFilter}
              onChange={(e) => onStockChange(e.target.value)}
              className="w-full sm:w-auto bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition shadow-2xs"
            >
              <option value="all">كافة حالات المخزون</option>
              <option value="out_of_stock">🔴 نفد بالكامل (0 قطع)</option>
              <option value="low_stock">🟡 مخزون منخفض (1 - 5 قطع)</option>
              <option value="in_stock">🟢 متوفر بالمخزن</option>
            </select>
          </div>

          {/* Category Filter Dropdown with Structured optgroups */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <span className="text-xs text-neutral-500 font-bold whitespace-nowrap">القسم:</span>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition shadow-2xs"
            >
              <option value="all">كافة الأقسام</option>
              {parentCats.map((parent) => {
                const subs = getSubcategories(parent.id);
                if (subs.length > 0) {
                  return (
                    <optgroup key={parent.id} label={`📁 ${parent.name}`}>
                      <option value={parent.id}>الكل في {parent.name}</option>
                      {subs.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          ↳ {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                }
                return (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                );
              })}
              {/* Standalone subcategories without mapped parent */}
              {categories
                .filter((c) => c.parentId && !parentCats.some((p) => p.id === c.parentId))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    ↳ {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
