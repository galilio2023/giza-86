"use client";

import { Trash2, Edit3, Tag, Clock } from "lucide-react";
import { CouponItem } from "@/types";
import { formatEGP } from "@/lib/utils";

interface CouponGridProps {
  coupons: CouponItem[];
  onEdit: (coupon: CouponItem) => void;
  onDelete: (coupon: CouponItem) => void;
  onToggleStatus: (id: number, currentActive: boolean) => void;
}

export function CouponGrid({
  coupons,
  onEdit,
  onDelete,
  onToggleStatus,
}: CouponGridProps) {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
        <Tag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-800">لا توجد كوبونات حالياً</h3>
        <p className="text-xs text-neutral-500 mt-1">ابدأ بإنشاء أول كود خصم لعملائك</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coupons.map((c) => (
        <div
          key={c.id}
          className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
            c.isActive
              ? "bg-white border-neutral-200/80 shadow-xs hover:border-amber-400/50"
              : "bg-neutral-50/60 border-dashed border-neutral-300 opacity-60"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    c.isActive
                      ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <span className="font-mono text-base font-black tracking-wider text-neutral-900">
                  {c.code}
                </span>
              </div>

              <button
                onClick={() => onToggleStatus(c.id, c.isActive)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  c.isActive
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    c.isActive ? "bg-emerald-500" : "bg-neutral-400"
                  }`}
                />
                {c.isActive ? "مفعّل" : "معطّل"}
              </button>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-2 mb-4 text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span>قيمة الخصم:</span>
                <span className="font-black text-neutral-900 text-sm">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}%`
                    : formatEGP(c.discountValue)}
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>الحد الأدنى للطلب:</span>
                <span className="font-bold text-neutral-800">
                  {Number(c.minOrderValue) > 0 ? formatEGP(c.minOrderValue) : "بدون حد أدنى"}
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>مرات الاستخدام:</span>
                <span className="font-bold text-neutral-800">
                  {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : "مرة (غير محدود)"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {c.createdAt ? new Date(c.createdAt).toLocaleDateString("ar-EG") : "-"}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(c)}
                className="p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-neutral-100 rounded-lg transition"
                title="تعديل الكوبون"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(c)}
                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition"
                title="حذف الكوبون"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
