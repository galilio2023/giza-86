import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Banknote, 
  Zap, 
  ShoppingBag
} from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { getOrderById, getStoreSettings } from "@/lib/data-service";
import { formatArabicDate, formatEGP } from "@/lib/utils";
import { ORDER_STATUSES, STORE_DEFAULTS, getPaymentMethodName } from "@/lib/egypt-constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PrintReceiptButton } from "@/components/store/PrintReceiptButton";
import { OrderItemsTable, OrderFinancialSummary } from "@/components/common/order";
import { buildOrderInquiryWhatsAppUrl } from "@/lib/domain/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrderById(id),
    getStoreSettings().catch(() => null),
  ]);
  const brandName = settings?.storeName || STORE_DEFAULTS.storeName;

  return {
    title: order ? `تفاصيل الطلب #${order.orderNumber} | ${brandName}` : `تفاصيل الطلب | ${brandName}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrderById(id),
    getStoreSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const statusConfig = ORDER_STATUSES[order.orderStatus] || ORDER_STATUSES.new;
  const whatsappInquiryUrl = buildOrderInquiryWhatsAppUrl(
    settings.supportWhatsapp || settings.whatsapp,
    settings.storeName || STORE_DEFAULTS.storeName,
    order.orderNumber
  );

  return (
    <StoreShell
      settings={settings}
      printHiddenShell
      mainClassName="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 print:p-0 print:max-w-none"
    >
      {/* Printable Official Invoice Header (Shown only when printing / saving as PDF) */}
        <div className="hidden print:flex justify-between items-start border-b-2 border-neutral-900 pb-4 mb-6 text-right">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-black text-neutral-950">{settings.storeName || STORE_DEFAULTS.storeName}</h1>
            <p className="text-xs text-neutral-600 font-medium">{settings.storeTagline || STORE_DEFAULTS.storeTagline}</p>
            <p className="text-xs text-neutral-500">
              هاتف: {settings.phone || STORE_DEFAULTS.phone}
              {settings.landlinePhone ? ` • أرضي: ${settings.landlinePhone}` : ""}
              {" • واتساب: "}{settings.supportWhatsapp || settings.whatsapp || STORE_DEFAULTS.whatsapp}
            </p>
          </div>
          <div className="text-left font-mono text-xs space-y-1">
            <div className="text-sm font-black text-neutral-900">فاتورة طلب #{order.orderNumber}</div>
            <div className="text-neutral-500">التاريخ: {formatArabicDate(order.createdAt)}</div>
            <div className="text-neutral-500">الحالة: {statusConfig.label}</div>
          </div>
        </div>

        {/* Success Header Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm text-center space-y-4 print:hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
              تم استلام طلبك بنجاح
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              شكراً لتسوقك معنا، {order.customerName.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              سيتواصل معك أحد ممثلي خدمة العملاء عبر الهاتف أو الواتساب لتأكيد خروج الشحنة مع المندوب.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="bg-neutral-100 px-4 py-2 rounded-xl text-xs">
              <span className="text-neutral-500">رقم الطلب: </span>
              <strong className="font-mono text-neutral-900 font-bold">{order.orderNumber}</strong>
            </div>

            <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
              الحالة: {statusConfig.label}
            </div>
          </div>

          {/* Quick 1-Click WhatsApp Instant Confirmation */}
          <div className="pt-3 flex justify-center">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/20 transition-all duration-300 active:scale-98"
            >
              <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
              <span>تأكيد موعد الشحن سريعاً عبر واتساب 💬</span>
            </a>
          </div>
        </div>

        {/* Order Details & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-black text-neutral-900 text-sm flex items-center gap-2 border-b pb-3">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>عنوان التوصيل</span>
            </h3>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span className="text-neutral-400">الاسم:</span>
                <span className="font-bold text-neutral-800">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">رقم الهاتف:</span>
                <span className="font-bold text-neutral-800" dir="ltr">{order.customerPhone}</span>
              </div>
              {order.alternatePhone && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">هاتف بديل:</span>
                  <span className="font-bold text-neutral-800" dir="ltr">{order.alternatePhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-400">المحافظة:</span>
                <span className="font-bold text-neutral-800">{order.governorate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">المدينة / الحي:</span>
                <span className="font-bold text-neutral-800">{order.city}</span>
              </div>
              <div className="pt-2 border-t text-neutral-700">
                <span className="text-neutral-400 block mb-0.5">العنوان التفصيلي:</span>
                <p className="font-medium leading-relaxed">{order.address}</p>
              </div>
              {order.notes && (
                <div className="pt-2 border-t text-neutral-500">
                  <span className="text-neutral-400 block mb-0.5">ملاحظات:</span>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Status */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-black text-neutral-900 text-sm flex items-center gap-2 border-b pb-3">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>طريقة الدفع والتوصيل</span>
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span className="text-neutral-400">طريقة الدفع:</span>
                <span className="font-bold text-neutral-900">
                  {getPaymentMethodName(order.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">حالة السداد:</span>
                <span className="font-bold text-amber-700">
                  {order.paymentStatus === "paid" ? "تم الدفع بنجاح" : "بانتظار التحصيل عند التسليم"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">تاريخ الطلب:</span>
                <span className="font-bold text-neutral-800">{formatArabicDate(order.createdAt)}</span>
              </div>

              {order.paymentMethod === "instapay" && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1 mt-2">
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    تعليمات إنستاباي:
                  </span>
                  <p className="text-[11px] text-purple-800 leading-relaxed">
                    إذا لم تقم بالتحويل بعد، يرجى إرسال مبلغ ({formatEGP(order.total)}) إلى:{" "}
                    <strong className="font-mono" dir="ltr">{settings.instapayHandle || STORE_DEFAULTS.instapayHandle}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs mt-6 space-y-4">
          <h3 className="font-black text-neutral-900 text-sm flex items-center gap-2 border-b pb-3">
            <Package className="w-4 h-4 text-amber-600" />
            <span>المنتجات المطلوبة ({order.items.length})</span>
          </h3>

          <OrderItemsTable items={order.items} />

          {/* Pricing Summary */}
          <OrderFinancialSummary
            subtotal={order.subtotal}
            shippingFee={order.shippingFee}
            discount={order.discount}
            total={order.total}
            couponCode={order.couponCode}
          />
        </div>

        {/* Action CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-neutral-950 hover:bg-neutral-900 text-amber-50 hover:text-white border border-[#c59b27]/80 hover:border-amber-400 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-black/20 group cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className="group-hover:text-amber-300 transition-colors">تواصل عبر واتساب بخصوص هذا الطلب</span>
            </Link>

            <PrintReceiptButton />
          </div>

          <Link
            href="/products"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>متابعة التسوق في المتجر</span>
          </Link>
        </div>
    </StoreShell>
  );
}
