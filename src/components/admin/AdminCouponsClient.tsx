"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CouponItem } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { api } from "@/lib/api-client";
import { CouponGrid, CouponFormModal } from "./coupons";

interface AdminCouponsClientProps {
  initialCoupons: CouponItem[];
}

export function AdminCouponsClient({ initialCoupons }: AdminCouponsClientProps) {
  const [loading, setLoading] = useState(false);

  const {
    items: coupons,
    setItems: setCoupons,
    modalOpen,
    setModalOpen,
    editingItem: editingCoupon,
    openCreateModal,
    openEditModal,
    deletingItem: deletingCoupon,
    setDeletingItem: setDeletingCoupon,
    isDeleting,
    handleConfirmDelete,
    handleItemSaved,
  } = useAdminCrud<CouponItem>({
    initialItems: initialCoupons,
    apiEndpoint: "/api/coupons",
    resourceName: "الكوبون",
    getItemDisplayName: (coupon) => coupon.code,
  });

  const handleSaveCoupon = async (payload: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue: number;
    isActive: boolean;
  }) => {
    setLoading(true);
    try {
      if (editingCoupon) {
        const updated = await api.coupons.update(editingCoupon.id, payload);
        toast.success(`تم تحديث بيانات الكوبون ${updated.code} بنجاح في قاعدة البيانات`);
        handleItemSaved(updated, true);
      } else {
        const created = await api.coupons.create(payload);
        toast.success(`تم إنشاء كوبون الخصم ${created.code} بنجاح في قاعدة البيانات`);
        handleItemSaved(created, false);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء حفظ الكوبون"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentActive: boolean) => {
    try {
      await api.coupons.update(id, { isActive: !currentActive });
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
      toast.info("تم تحديث حالة تفعيل الكوبون في قاعدة البيانات");
    } catch {
      toast.error("فشل في تحديث حالة الكوبون");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            كوبونات وقسائم الخصم
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            إدارة وإنشاء حملات الخصومات الترويجية وتحديد نسب الخصم وحدود الطلبات
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>إنشاء كوبون جديد</span>
        </Button>
      </div>

      <CouponGrid
        coupons={coupons}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={setDeletingCoupon}
      />

      <CouponFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingCoupon={editingCoupon}
        onSave={handleSaveCoupon}
        loading={loading}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingCoupon)}
        onClose={() => setDeletingCoupon(null)}
        onConfirm={handleConfirmDelete}
        title="حذف كوبون الخصم"
        description={`هل أنت متأكد من رغبتك في حذف الكوبون "${deletingCoupon?.code}" نهائياً من قاعدة البيانات؟`}
        confirmText="نعم، احذف الكوبون"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
