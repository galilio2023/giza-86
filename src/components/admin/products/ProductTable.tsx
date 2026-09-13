"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit3, Trash2, ExternalLink } from "lucide-react";
import { ProductItem } from "@/types";
import { formatEGP } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminEmptyState, AdminPagination } from "@/components/admin/ui";

interface ProductTableProps {
  products: ProductItem[];
  onEdit: (product: ProductItem) => void;
  onDelete: (id: number, name: string) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  onPageChange,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <AdminEmptyState
        title="لا توجد منتجات مطابقة"
        description="لم يتم العثور على أي منتج يطابق معايير البحث المحددة"
      />
    );
  }

  return (
    <Card variant="modern" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500">
              <th className="p-4 font-bold">المنتج</th>
              <th className="p-4 font-bold">القسم</th>
              <th className="p-4 font-bold">السعر الأساسي</th>
              <th className="p-4 font-bold">سعر الخصم</th>
              <th className="p-4 font-bold">المخزون</th>
              <th className="p-4 font-bold">المقاسات</th>
              <th className="p-4 font-bold">الصور</th>
              <th className="p-4 font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50/60 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                      <Image
                        src={p.images[0] || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 block line-clamp-1">{p.name}</span>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono mt-0.5">
                        <span>{p.sku}</span>
                        {p.badgeText && (
                          <span className="text-[10px] font-sans font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200/60">
                            {p.badgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium text-neutral-600">
                  {p.categoryName || "عام"}
                </td>
                <td className="p-4 font-bold text-neutral-900">{formatEGP(p.price)}</td>
                <td className="p-4">
                  {p.salePrice ? (
                    <span className="font-bold text-rose-600">{formatEGP(p.salePrice)}</span>
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      p.stock <= 5
                        ? "bg-rose-100 text-rose-700"
                        : p.stock <= 15
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {p.stock} قطعة
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-[130px]">
                    {p.sizes.map((s) => (
                      <span
                        key={s}
                        className="bg-neutral-100 text-neutral-700 text-[10px] px-1.5 py-0.5 rounded font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-neutral-600 font-bold bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                    {p.images.length} صور
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${encodeURIComponent(p.slug || String(p.id))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-neutral-100 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
                      title="معاينة في المتجر"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(p)}
                      className="p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                      title="تعديل المنتج"
                      type="button"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(p.id, p.name)}
                      className="p-1.5 text-neutral-600 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                      title="حذف المنتج"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onPageChange && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          currentCount={products.length}
          itemLabel="منتج"
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}
