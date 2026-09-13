"use client";

import { useState } from "react";
import { 
  Phone, 
  Printer, 
  Truck, 
  Save 
} from "lucide-react";
import { OrderItem } from "@/types";
import { formatArabicDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { OrderItemsTable, OrderFinancialSummary } from "@/components/common/order";
import { buildCustomerContactWhatsAppUrl } from "@/lib/domain/whatsapp";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  onUpdate: (
    orderId: number,
    newStatus: OrderItem["orderStatus"],
    newPayment?: OrderItem["paymentStatus"],
    trackingNum?: string
  ) => Promise<void>;
  updating: boolean;
  storeName?: string;
}

export function OrderDetailModal({
  order,
  onClose,
  onUpdate,
  updating,
  storeName,
}: OrderDetailModalProps) {
  const [modalStatus, setModalStatus] = useState<OrderItem["orderStatus"]>("new");
  const [modalPayment, setModalPayment] = useState<OrderItem["paymentStatus"]>("pending");
  const [modalTracking, setModalTracking] = useState("");

  const [prevOrderId, setPrevOrderId] = useState<string | number | null>(order?.id ?? null);
  if (order && order.id !== prevOrderId) {
    setPrevOrderId(order.id);
    setModalStatus(order.orderStatus);
    setModalPayment(order.paymentStatus);
    setModalTracking(order.trackingNumber || "");
  }

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:w-full max-w-3xl p-4 sm:p-8 rounded-3xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-700">
              {order.orderNumber}
            </span>
            <DialogTitle className="text-lg sm:text-xl font-black text-neutral-900">
              تفاصيل بوليصة الطلب والشحنة
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 min-h-[40px] px-3.5 w-full sm:w-auto"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوليصة (AWB)</span>
            </Button>
          </div>
        </div>

        {/* Quick Contact & Action Buttons for Delivery Rider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${order.customerPhone}`}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition min-h-[40px]"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>اتصال بالعميل</span>
            </a>

            <a
              href={buildCustomerContactWhatsAppUrl(
                order.customerPhone,
                order.customerName,
                order.orderNumber,
                storeName || "GIZA 86"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-neutral-950 text-white border border-[#c59b27]/80 hover:border-amber-400 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group shadow-xs cursor-pointer min-h-[40px]"
            >
              <WhatsAppIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="group-hover:text-amber-300 transition-colors">مراسلة واتساب</span>
            </a>
          </div>

          <div className="flex items-center justify-end gap-2 text-xs">
            <span className="font-bold text-neutral-700">تاريخ التسجيل:</span>
            <span className="text-neutral-600 font-medium">
              {formatArabicDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Admin Order Control Controls (Status, Payment, Tracking) */}
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3 text-xs">
          <h4 className="font-black text-neutral-900 text-sm border-b pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>التحكم الإداري في الشحنة والدفع</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-neutral-800 mb-1">مرحلة الشحنة والطلب:</label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value as OrderItem["orderStatus"])}
                className="w-full bg-white border border-neutral-300 font-bold p-2 rounded-xl text-base sm:text-xs"
              >
                <option value="new">طلب جديد</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="processing">قيد التجهيز</option>
                <option value="shipped">تم الشحن مع مندوب</option>
                <option value="delivered">تم التوصيل بنجاح</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">حالة الدفع والتحويل:</label>
              <select
                value={modalPayment}
                onChange={(e) => setModalPayment(e.target.value as OrderItem["paymentStatus"])}
                className="w-full bg-white border border-neutral-300 font-bold p-2 rounded-xl text-base sm:text-xs"
              >
                <option value="pending">قيد الانتظار (Pending)</option>
                <option value="paid">تم التأكيد والدفع بنجاح (Paid)</option>
                <option value="failed">فشل أو إلغاء الدفع (Failed)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">رقم بوليصة الشحن (AWB):</label>
              <input
                type="text"
                value={modalTracking}
                onChange={(e) => setModalTracking(e.target.value)}
                placeholder="مثال: BOSTA-98214"
                className="w-full bg-white border border-neutral-300 font-mono text-left p-2 rounded-xl text-base sm:text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              disabled={updating}
              onClick={() => onUpdate(order.id, modalStatus, modalPayment, modalTracking)}
              className="gap-2 min-h-[42px] w-full sm:w-auto justify-center"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{updating ? "جاري الحفظ..." : "حفظ تحديثات الطلب في قاعدة البيانات"}</span>
            </Button>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-1.5">
            <h4 className="font-bold text-neutral-900 border-b pb-1">بيانات العميل:</h4>
            <div>
              <span className="text-neutral-500">الاسم: </span>
              <strong className="text-neutral-900">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-neutral-500">رقم الهاتف: </span>
              <strong className="text-neutral-900" dir="ltr">{order.customerPhone}</strong>
            </div>
            {order.alternatePhone && (
              <div>
                <span className="text-neutral-500">هاتف بديل: </span>
                <strong className="text-neutral-900" dir="ltr">{order.alternatePhone}</strong>
              </div>
            )}
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-1.5">
            <h4 className="font-bold text-neutral-900 border-b pb-1">عنوان التوصيل في مصر:</h4>
            <div>
              <span className="text-neutral-500">المحافظة والمدينة: </span>
              <strong className="text-neutral-900">{order.governorate} - {order.city}</strong>
            </div>
            <div>
              <span className="text-neutral-500">العنوان التفصيلي: </span>
              <p className="font-medium text-neutral-800 leading-relaxed mt-0.5">{order.address}</p>
            </div>
            {order.notes && (
              <div>
                <span className="text-neutral-500">ملاحظات: </span>
                <p className="text-neutral-600">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-neutral-900 border-b pb-1">محتويات الطلب:</h4>
          <OrderItemsTable items={order.items} compact showVariantBadge />
        </div>

        {/* Financial Breakdown */}
        <OrderFinancialSummary
          subtotal={order.subtotal}
          shippingFee={order.shippingFee}
          discount={order.discount}
          total={order.total}
          couponCode={order.couponCode}
          compact
        />
      </DialogContent>
    </Dialog>
  );
}
