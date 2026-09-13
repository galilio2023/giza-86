"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, AlertCircle, MapPin, ArrowLeft } from "lucide-react";
import { formatEGP, formatArabicDate, getErrorMessage } from "@/lib/utils";
import { ORDER_STATUSES, isValidEgyptianPhone, STORE_DEFAULTS } from "@/lib/egypt-constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { toast } from "sonner";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { StoreSettingsItem } from "@/types";
import { api } from "@/lib/api-client";
import { OrderItemsTable } from "@/components/common/order";
import { buildOrderInquiryWhatsAppUrl } from "@/lib/domain/whatsapp";

interface TrackedOrder {
  orderNumber: string;
  orderStatus: keyof typeof ORDER_STATUSES;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "cod" | "instapay" | "vodafone_cash" | "card";
  customerName: string;
  governorate: string;
  city: string;
  address: string;
  trackingNumber?: string;
  items: {
    productId: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
}

interface OrderTrackClientProps {
  settings?: Partial<StoreSettingsItem> | null;
}

export function OrderTrackClient({ settings }: OrderTrackClientProps = {}) {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trackWaUrl = order
    ? buildOrderInquiryWhatsAppUrl(
        settings?.whatsapp,
        settings?.storeName || STORE_DEFAULTS.storeName,
        order.orderNumber
      )
    : "#";

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error("يرجى إدخال رقم الطلب");
      return;
    }
    if (!isValidEgyptianPhone(phone)) {
      toast.error("يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await api.orders.track({ orderNumber: orderNumber.trim(), phone: phone.trim() });

      setOrder(data);
      toast.success("تم العثور على بيانات الطلب بنجاح");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "حدث خطأ أثناء البحث عن الطلب");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = order ? ORDER_STATUSES[order.orderStatus] || ORDER_STATUSES.new : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          خدمة التتبع الفوري 🇪🇬
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
          متابعة وتتبع حالة الشحنة
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          أدخل رقم طلبك ورقم هاتفك المسجل لتتبع خط سير الشحنة مع المندوب ومعرفة موعد التسليم
        </p>
      </div>

      {/* Lookup Form */}
      <Card variant="modern" className="p-6 sm:p-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                رقم الطلب (مثال: EG-2026-...)
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="EG-2026-..."
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-base sm:text-sm font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                رقم هاتف المستلم (11 رقم)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010xxxxxxxx"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-base sm:text-sm font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            <Search className="w-4 h-4 ml-2" />
            <span>{loading ? "جاري البحث في قاعدة البيانات..." : "تتبع مسار الشحنة"}</span>
          </Button>
        </form>
      </Card>

      {/* Error state */}
      {error && (
        <Card variant="subtle" className="p-6 bg-rose-50 border-rose-200 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-sm font-bold text-rose-800">{error}</p>
          <p className="text-xs text-rose-600">
            يرجى التأكد من كتابة رقم الطلب كما وصلك في رسالة التأكيد أو الفاتورة، ورقم الهاتف المستخدم أثناء الشراء.
          </p>
        </Card>
      )}

      {/* Order Result Card */}
      {order && statusConfig && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card variant="modern" className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
              <div>
                <span className="text-xs text-neutral-400 font-medium">رقم الطلب</span>
                <h3 className="font-mono font-black text-xl text-neutral-900">{order.orderNumber}</h3>
                <span className="text-xs text-neutral-500 mt-1 block">
                  تاريخ التسجيل: {formatArabicDate(order.createdAt)}
                </span>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <OrderStatusBadge
                  status={order.orderStatus}
                  className="text-xs px-3.5 py-1.5 rounded-xl"
                />
                {order.trackingNumber && (
                  <div className="text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg font-mono">
                    بوليصة الشحن: <strong>{order.trackingNumber}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl text-xs">
              <div className="space-y-1">
                <span className="font-bold text-neutral-500 block">بيانات العميل والتوصيل:</span>
                <div className="font-bold text-neutral-900">{order.customerName}</div>
                <div className="text-neutral-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{order.governorate} - {order.city}</span>
                </div>
                <div className="text-neutral-600">{order.address}</div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-neutral-500 block">طريقة الدفع والحساب:</span>
                <div className="font-bold text-neutral-800">
                  {order.paymentMethod === "cod" && "الدفع نقداً عند الاستلام (COD)"}
                  {order.paymentMethod === "instapay" && "تحويل عبر إنستاباي (InstaPay)"}
                  {order.paymentMethod === "vodafone_cash" && "محفظة فودافون كاش (Vodafone Cash)"}
                  {order.paymentMethod === "card" && "بطاقة بنكية / ميزة"}
                </div>
                <div className="text-neutral-600">
                  حالة الدفع: {order.paymentStatus === "paid" ? "مدفوع بنجاح" : "بانتظار التحصيل"}
                </div>
                <div className="text-base font-black text-amber-700 pt-1">
                  الإجمالي: {formatEGP(order.total)}
                </div>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-neutral-900">محتويات الشحنة ({order.items.length} قطع)</h4>
              <div className="border border-neutral-100 rounded-2xl overflow-hidden p-3 sm:p-4">
                <OrderItemsTable items={order.items} compact />
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
              <a
                href={trackWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-neutral-950 hover:bg-neutral-900 text-amber-50 hover:text-white border border-[#c59b27]/80 hover:border-amber-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm group active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
                <span>استفسار عبر واتساب بخصوص هذه الشحنة</span>
              </a>

              <Link href="/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-3.5 h-3.5 ml-1.5" />
                  <span>متابعة التسوق في المتجر</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
