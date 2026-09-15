"use client";

import { useState, useOptimistic, startTransition as reactStartTransition } from "react";
import { useAdminTableParams } from "@/hooks/useAdminTableParams";
import { OrderItem } from "@/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import {
  OrderFilterBar,
  OrderTable,
  OrderDetailModal,
} from "./orders";

interface OrderOptimisticUpdate {
  orderId: number;
  orderStatus: OrderItem["orderStatus"];
  paymentStatus?: OrderItem["paymentStatus"];
  trackingNumber?: string;
}

interface AdminOrdersClientProps {
  initialOrders: OrderItem[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  statusCounts?: Record<string, number>;
  storeName?: string;
}

/** Coordinates admin order management with status tabs, customer details modal, and courier tracking updates. */
export function AdminOrdersClient({
  initialOrders,
  totalCount,
  currentPage = 1,
  pageSize = 20,
  statusCounts,
  storeName,
}: AdminOrdersClientProps) {
  const [prevInitialOrders, setPrevInitialOrders] = useState<OrderItem[]>(initialOrders);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [updating, setUpdating] = useState(false);

  // Safely synchronize state when server-rendered initialOrders change without cascading renders
  if (prevInitialOrders !== initialOrders) {
    setPrevInitialOrders(initialOrders);
    setOrders(initialOrders);
  }

  const {
    searchQuery,
    setSearchQuery,
    activeFilter: statusFilter,
    handleFilterChange: handleStatusFilterChange,
    handlePageChange,
    router,
  } = useAdminTableParams({
    baseUrl: "/admin/orders",
    defaultFilter: "all",
    filterParamName: "status",
  });

  // Optimistic UI for immediate feedback
  const [optimisticOrders, setOptimisticOrders] = useOptimistic(
    orders,
    (currentOrders: OrderItem[], update: OrderOptimisticUpdate) =>
      currentOrders.map((o) => {
        if (o.id === update.orderId) {
          return {
            ...o,
            orderStatus: update.orderStatus,
            paymentStatus: update.paymentStatus ?? o.paymentStatus,
            trackingNumber: update.trackingNumber !== undefined ? update.trackingNumber : o.trackingNumber,
          };
        }
        return o;
      })
  );

  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderItem["orderStatus"],
    newPayment?: OrderItem["paymentStatus"],
    trackingNum?: string
  ) => {
    setUpdating(true);

    reactStartTransition(async () => {
      setOptimisticOrders({
        orderId,
        orderStatus: newStatus,
        paymentStatus: newPayment,
        trackingNumber: trackingNum,
      });

      try {
        const updated = await api.orders.update(orderId, {
          orderStatus: newStatus,
          paymentStatus: newPayment,
          trackingNumber: trackingNum !== undefined ? trackingNum : undefined,
        });

        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }
        toast.success("تم تحديث بيانات الطلب والشحنة بنجاح في قاعدة البيانات");
        router.refresh();
      } catch {
        toast.error("فشل في تحديث بيانات الطلب - تمت استعادة الحالة الأصلية");
      } finally {
        setUpdating(false);
      }
    });
  };

  const total = totalCount ?? orders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <OrderFilterBar
        ordersCount={total}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        orders={optimisticOrders}
        statusCounts={statusCounts}
      />

      <OrderTable
        orders={optimisticOrders}
        onOpenDetail={setSelectedOrder}
        onStatusUpdate={handleStatusUpdate}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={total}
        onPageChange={handlePageChange}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={handleStatusUpdate}
        updating={updating}
        storeName={storeName}
      />
    </div>
  );
}

