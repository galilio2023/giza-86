"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Shirt, 
  AlertTriangle, 
  ArrowUpRight, 
  MapPin, 
  Plus 
} from "lucide-react";
import { OrderItem, ProductItem } from "@/types";
import { formatEGP } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_METHOD_SHORT_NAMES } from "@/lib/egypt-constants";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { DashboardStats } from "@/lib/data-service";

interface AdminDashboardClientProps {
  initialOrders?: OrderItem[];
  initialProducts?: ProductItem[];
  initialStats?: DashboardStats;
  lowStockItems?: ProductItem[];
}

export function AdminDashboardClient({
  initialOrders,
  initialProducts,
  initialStats,
  lowStockItems,
}: AdminDashboardClientProps) {
  const [orders, setOrders] = useState<OrderItem[]>(
    initialStats?.recentOrders || initialOrders || []
  );
  const [lowStockProducts] = useState<ProductItem[]>(
    lowStockItems || initialProducts?.filter((p) => p.stock <= 10) || []
  );

  const totalRevenue = initialStats?.totalRevenue ?? (initialOrders ? initialOrders.reduce((acc, o) => acc + o.total, 0) : 0);
  const totalOrders = initialStats?.totalOrders ?? (initialOrders ? initialOrders.length : 0);
  const aov = initialStats?.aov ?? (totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0);
  const newOrdersCount = initialStats?.newOrdersCount ?? (initialOrders ? initialOrders.filter((o) => o.orderStatus === "new").length : 0);
  const lowStockCount = initialStats?.lowStockCount ?? lowStockProducts.length;

  const handleStatusChange = async (orderId: number, newStatus: OrderItem["orderStatus"]) => {
    try {
      await api.orders.update(orderId, { orderStatus: newStatus });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch {
      toast.error("فشل في تحديث الحالة");
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            لوحة الإحصائيات والمتابعة
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            متابعة فورية للمبيعات، الشحنات، والمخزون في جمهورية مصر العربية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>إضافة منتج جديد</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <Card variant="modern" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">إجمالي المبيعات</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {formatEGP(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">
            إجمالي المبيعات المحققة للطلبات المؤكدة
          </span>
        </Card>

        {/* Total Orders */}
        <Card variant="modern" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">عدد الطلبات المسجلة</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">{totalOrders} طلب</div>
          <span className="text-[11px] text-blue-600 font-bold block">
            {newOrdersCount} طلبات جديدة بانتظار التأكيد
          </span>
        </Card>

        {/* Average Order Value */}
        <Card variant="modern" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">متوسط قيمة السلة (AOV)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">{formatEGP(aov)}</div>
          <span className="text-[11px] text-neutral-400 font-medium block">
            معدل الشراء للعميل الواحد
          </span>
        </Card>

        {/* Low Stock Warning */}
        <Card variant="modern" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">تنبيهات المخزون</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {lowStockCount} منتجات
          </div>
          <span className="text-[11px] text-rose-500 font-bold block">
            أقل من 10 قطع بالمخزن - يلزم إعادة إنتاج
          </span>
        </Card>
      </div>

      {/* Orders Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card variant="subtle" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-black text-neutral-900 text-base">أحدث الطلبات المستلمة</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                تحديث ومتابعة فورية مع المندوبين
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>عرض كل الطلبات ({totalOrders})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-3 font-bold">رقم الطلب</th>
                  <th className="pb-3 font-bold">العميل والمحافظة</th>
                  <th className="pb-3 font-bold">طريقة الدفع</th>
                  <th className="pb-3 font-bold">الإجمالي</th>
                  <th className="pb-3 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.slice(0, 5).map((order) => {
                  const status = ORDER_STATUSES[order.orderStatus] || ORDER_STATUSES.new;
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3 font-mono font-bold text-neutral-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-neutral-800 block">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-neutral-400 block">
                          {order.governorate} - {order.city}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-neutral-700">
                          {PAYMENT_METHOD_SHORT_NAMES[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 font-black text-neutral-900">
                        {formatEGP(order.total)}
                      </td>
                      <td className="py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderItem["orderStatus"])}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${status.bg} ${status.color}`}
                        >
                          <option value="new">طلب جديد</option>
                          <option value="confirmed">تم التأكيد</option>
                          <option value="processing">قيد التجهيز</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Governorates Distribution & Alerts */}
        <div className="space-y-6">
          <Card variant="subtle" className="space-y-4">
            <h3 className="font-black text-neutral-900 text-base flex items-center gap-2 border-b pb-3">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>توزيع المبيعات في محافظات مصر</span>
            </h3>

            <div className="space-y-3 text-xs">
              {(initialStats?.governoratesDistribution || []).map((dist) => (
                <div key={dist.region} className="space-y-1">
                  <div className="flex justify-between font-bold text-neutral-800">
                    <span className="truncate max-w-[200px]">{dist.region}</span>
                    <span className="font-mono text-neutral-600">
                      {dist.percentage}% {dist.count > 0 ? `(${dist.count} طلب)` : ""}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${dist.colorClass} transition-all duration-500`}
                      style={{ width: `${Math.max(dist.percentage, dist.count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Low Stock Items Alert Card */}
          <Card variant="subtle" className="space-y-4">
            <h3 className="font-black text-neutral-900 text-sm flex items-center gap-2 border-b pb-3">
              <Shirt className="w-4 h-4 text-rose-600" />
              <span>منتجات قاربت على النفاد</span>
            </h3>

            <div className="space-y-3">
              {lowStockProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div className="truncate max-w-[180px]">
                    <span className="font-bold text-neutral-800 block truncate">{p.name}</span>
                    <span className="text-[10px] text-neutral-400">{p.sku || "كود غير محدد"}</span>
                  </div>
                  <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-md">
                    متبقي {p.stock}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="block text-center text-xs font-bold text-amber-700 hover:text-amber-800 pt-2 border-t"
            >
              تحديث كميات المخزون
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
