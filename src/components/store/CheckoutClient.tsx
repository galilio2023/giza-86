"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { StoreSettingsItem } from "@/types";
import { CheckoutAddressSection } from "./checkout/CheckoutAddressSection";
import { CheckoutPaymentSection } from "./checkout/CheckoutPaymentSection";
import { CheckoutSummarySection } from "./checkout/CheckoutSummarySection";
import { useMounted } from "@/hooks/useMounted";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

interface CheckoutClientProps {
  settings?: Partial<StoreSettingsItem>;
}

export function CheckoutClient({ settings }: CheckoutClientProps = {}) {
  const router = useRouter();
  const mounted = useMounted();

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  // Enabled payment methods from CMS settings
  const enabledPaymentMethods: string[] =
    settings?.enabledPaymentMethods && settings.enabledPaymentMethods.length > 0
      ? settings.enabledPaymentMethods
      : ["cod", "instapay", "vodafone_cash", "card"];

  const subtotal = mounted ? getSubtotal() : 0;
  const freeThreshold = settings?.freeShippingThreshold ?? STORE_DEFAULTS.freeShippingThreshold;

  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    alternatePhone,
    setAlternatePhone,
    selectedGovernorate,
    setSelectedGovernorate,
    city,
    setCity,
    address,
    setAddress,
    notes,
    setNotes,
    paymentMethod,
    setPaymentMethod,
    formErrors,
    clearError,
    fullNameRef,
    phoneRef,
    cityRef,
    addressRef,
    vodafoneSenderRef,
    couponCode,
    setCouponCode,
    discountAmount,
    shippingFee,
    finalTotal,
    appliedCoupon,
    couponLoading,
    handleApplyCoupon,
    transferRef,
    setTransferRef,
    vodafoneSenderPhone,
    setVodafoneSenderPhone,
    copiedInstapay,
    copiedVodafone,
    handleCopy,
    submitting,
    handleSubmitOrder,
  } = useCheckoutForm({
    items,
    subtotal,
    freeShippingThreshold: freeThreshold,
    governoratesShipping: settings?.governoratesShipping,
    enabledPaymentMethods,
    onOrderSuccess: (created) => {
      clearCart();
      router.push(`/order-success/${created.orderNumber || created.id}`);
    },
  });

  if (!mounted) {
    return (
      <div className="layout-container py-8 sm:py-12 animate-pulse">
        <div className="mb-8 border-b border-neutral-200 pb-4">
          <div className="h-4 bg-neutral-100 rounded w-40 mb-2" />
          <div className="h-8 bg-neutral-200 rounded w-64" />
          <div className="h-4 bg-neutral-100 rounded w-80 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-neutral-100 rounded w-24" />
                  <div className="h-10 bg-neutral-100 rounded-xl w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div className="h-6 bg-neutral-200 rounded w-1/2" />
              <div className="h-4 bg-neutral-100 rounded w-full" />
              <div className="h-4 bg-neutral-100 rounded w-3/4" />
              <div className="h-12 bg-neutral-200 rounded-xl w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Master Kill Switch: Check if store is currently accepting orders
  if (settings?.isAcceptingOrders === false) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">استقبال الطلبات متوقف مؤقتاً</h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
          {settings.orderClosedMessage || STORE_DEFAULTS.orderClosedMessage}
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-neutral-800 transition"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-neutral-900">سلتك فارغة!</h2>
        <p className="text-xs text-neutral-500">
          يرجى إضافة منتجات إلى سلتك أولاً قبل الدخول لصفحة إتمام الطلب.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-bold"
        >
          تصفح الملابس الآن
        </Link>
      </div>
    );
  }

  const isFreeShipping = shippingFee === 0;

  return (
    <div className="layout-container py-8 sm:py-12">
      <div className="mb-8 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
          <Link href="/cart" className="hover:text-neutral-900">
            سلة المشتريات
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">إتمام الطلب والدفع</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
          تأكيد الطلب وبيانات الشحن
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          يرجى إدخال عنوانك بدقة لضمان سرعة التوصيل مع مندوب الشحن
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            <CheckoutAddressSection
              fullName={fullName}
              setFullName={setFullName}
              fullNameRef={fullNameRef}
              phone={phone}
              setPhone={setPhone}
              phoneRef={phoneRef}
              alternatePhone={alternatePhone}
              setAlternatePhone={setAlternatePhone}
              selectedGovernorate={selectedGovernorate}
              setSelectedGovernorate={setSelectedGovernorate}
              city={city}
              setCity={setCity}
              cityRef={cityRef}
              address={address}
              setAddress={setAddress}
              addressRef={addressRef}
              notes={notes}
              setNotes={setNotes}
              formErrors={formErrors}
              clearError={clearError}
            />

            <CheckoutPaymentSection
              enabledPaymentMethods={enabledPaymentMethods}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              finalTotal={finalTotal}
              instapayHandle={settings?.instapayHandle}
              transferRef={transferRef}
              setTransferRef={setTransferRef}
              copiedInstapay={copiedInstapay}
              vodafoneCashPhone={settings?.vodafoneCashPhone}
              vodafoneSenderPhone={vodafoneSenderPhone}
              setVodafoneSenderPhone={setVodafoneSenderPhone}
              vodafoneSenderRef={vodafoneSenderRef}
              copiedVodafone={copiedVodafone}
              handleCopy={handleCopy}
              formErrors={formErrors}
              clearError={clearError}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <CheckoutSummarySection
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              selectedGovernorate={selectedGovernorate}
              isFreeShipping={isFreeShipping}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleApplyCoupon={handleApplyCoupon}
              couponLoading={couponLoading}
              appliedCoupon={appliedCoupon}
              submitting={submitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
