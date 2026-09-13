"use client";

import { Eye } from "lucide-react";
import { OrderItem } from "@/types";
import { formatEGP } from "@/lib/utils";
import { ORDER_STATUSES, getPaymentMethodName } from "@/lib/egypt-constants";
import { Card } from "@/components/ui/card";
import { PaymentStatusBadge } from "@/components/ui/order-status-badge";
import { AdminEmptyState, AdminPagination } from "@/components/admin/ui";

interface OrderTableProps {
  orders: OrderItem[];
  onOpenDetail: (order: OrderItem) => void;
  onStatusUpdate: (
    orderId: number,
    newStatus: OrderItem["orderStatus"],
    newPayment?: OrderItem["paymentStatus"],
    trackingNum?: string
  ) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}

export function OrderTable({
  orders,
  onOpenDetail,
  onStatusUpdate,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  onPageChange,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <AdminEmptyState
        title="لا توجد طلبات مطابقة"
        description="لم يتم العثور على أي طلب يطابق معايير البحث المحددة"
      />
    );
  }

  return (
    <Card variant="modern" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500">
              <th className="p-4 font-bold">رقم الطلب</th>
              <th className="p-4 font-bold">العميل والتواصل</th>
              <th className="p-4 font-bold">المحافظة والمدينة</th>
              <th className="p-4 font-bold">القطع المطلوبة</th>
              <th className="p-4 font-bold">الإجمالي</th>
              <th className="p-4 font-bold">طريقة الدفع والحالة</th>
              <th className="p-4 font-bold">مرحلة الشحنة</th>
              <th className="p-4 font-bold">بوليصة الشحن</th>
              <th className="p-4 font-bold">تفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => {
              return (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition">
                  <td className="p-4 font-mono font-bold text-neutral-900">
                    {order.orderNumber}
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-neutral-900 block">{order.customerName}</span>
                      <span className="text-[11px] font-mono text-neutral-500 block" dir="ltr">
                        {order.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600">
                    <span className="font-bold block text-neutral-800">{order.governorate}</span>
                    <span className="text-[11px] text-neutral-400 block">{order.city}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px]">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطع
                    </span>
                  </td>
                  <td className="p-4 font-bold text-neutral-900">{formatEGP(order.total)}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-neutral-600 font-bold block">
                        {getPaymentMethodName(order.paymentMethod, true)}
                      </span>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        onStatusUpdate(
                          order.id,
                          e.target.value as OrderItem["orderStatus"],
                          undefined,
                          undefined
                        )
                      }
                      className={`text-xs font-bold rounded-lg border px-2.5 py-1 transition cursor-pointer ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : order.orderStatus === "cancelled" || order.orderStatus === "returned"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : order.orderStatus === "shipped"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : order.orderStatus === "processing"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    {order.trackingNumber ? (
                      <span className="font-mono text-[11px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 block max-w-[110px] truncate">
                        {order.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onOpenDetail(order)}
                      className="p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                      title="عرض كامل تفاصيل الطلب"
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {onPageChange && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          currentCount={orders.length}
          itemLabel="طلب"
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}
