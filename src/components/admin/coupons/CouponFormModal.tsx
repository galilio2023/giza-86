"use client";

import { useState } from "react";
import { CouponItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCoupon: CouponItem | null;
  onSave: (payload: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue: number;
    isActive: boolean;
  }) => Promise<void>;
  loading: boolean;
}

function CouponFormContent({
  editingCoupon,
  onSave,
  loading,
  onClose,
}: Omit<CouponFormModalProps, "isOpen">) {
  const [code, setCode] = useState(editingCoupon?.code || "");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    editingCoupon?.discountType || "percentage"
  );
  const [discountValue, setDiscountValue] = useState(
    editingCoupon?.discountValue ? String(editingCoupon.discountValue) : ""
  );
  const [minOrderValue, setMinOrderValue] = useState(
    editingCoupon?.minOrderValue ? String(editingCoupon.minOrderValue) : "500"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    await onSave({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      isActive: editingCoupon ? editingCoupon.isActive : true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
      <div>
        <label className="block font-bold text-neutral-800 mb-1">كود الكوبون</label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="مثال: SUMMER30"
          className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono uppercase"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-neutral-800 mb-1">نوع الخصم</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
            className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white font-bold"
          >
            <option value="percentage">نسبة مئوية (%)</option>
            <option value="fixed">مبلغ ثابت (ج.م)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-neutral-800 mb-1">قيمة الخصم</label>
          <input
            type="number"
            required
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={discountType === "percentage" ? "20" : "100"}
            className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-neutral-800 mb-1">
          الحد الأدنى لقيمة الطلب (ج.م)
        </label>
        <input
          type="number"
          value={minOrderValue}
          onChange={(e) => setMinOrderValue(e.target.value)}
          placeholder="500"
          className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono"
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
          {loading ? "جاري الحفظ..." : editingCoupon ? "تحديث الكوبون" : "إنشاء الكوبون"}
        </Button>
      </div>
    </form>
  );
}

export function CouponFormModal({
  isOpen,
  onClose,
  editingCoupon,
  onSave,
  loading,
}: CouponFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-neutral-900">
            {editingCoupon ? `تعديل كوبون الخصم (${editingCoupon.code})` : "إنشاء كوبون خصم جديد"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <CouponFormContent
            key={editingCoupon ? `edit-${editingCoupon.id}` : "create"}
            editingCoupon={editingCoupon}
            onSave={onSave}
            loading={loading}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
