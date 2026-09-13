"use client";

import { useState, useRef, FormEvent } from "react";
import { CartItem, OrderItem } from "@/types";
import { EGYPTIAN_GOVERNORATES, STORE_DEFAULTS } from "@/lib/egypt-constants";
import { CheckoutFormErrors } from "@/components/store/checkout/CheckoutAddressSection";
import { checkoutFormSchema } from "@/lib/validations/order.schema";
import { getErrorMessage } from "@/lib/utils";
import { calculateShippingFee, calculateOrderTotal } from "@/lib/domain/pricing";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

import { useCouponApply } from "@/hooks/useCouponApply";
import { usePaymentTransfer } from "@/hooks/usePaymentTransfer";

export interface UseCheckoutFormOptions {
  items: CartItem[];
  subtotal: number;
  freeShippingThreshold?: number;
  governoratesShipping?: Record<string, number>;
  enabledPaymentMethods?: string[];
  onOrderSuccess: (order: OrderItem) => void;
}

export function useCheckoutForm({
  items,
  subtotal,
  freeShippingThreshold = STORE_DEFAULTS.freeShippingThreshold,
  governoratesShipping,
  enabledPaymentMethods = ["cod", "instapay", "vodafone_cash", "card"],
  onOrderSuccess,
}: UseCheckoutFormOptions) {
  // Form Field State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState(EGYPTIAN_GOVERNORATES[0].name);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "instapay" | "vodafone_cash" | "card">(
    (enabledPaymentMethods[0] as "cod" | "instapay" | "vodafone_cash" | "card") || "cod"
  );

  // Validation State & Input element refs
  const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const vodafoneSenderRef = useRef<HTMLInputElement>(null);

  const clearError = (field: keyof CheckoutFormErrors) => {
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Composed Coupon Hook
  const {
    couponCode,
    setCouponCode,
    discountAmount,
    appliedCoupon,
    couponLoading,
    handleApplyCoupon: applyCouponAction,
  } = useCouponApply();

  const handleApplyCoupon = (e: FormEvent) => applyCouponAction(e, subtotal);

  // Composed Payment Transfer Hook
  const {
    transferRef,
    setTransferRef,
    vodafoneSenderPhone,
    setVodafoneSenderPhone,
    copiedInstapay,
    copiedVodafone,
    handleCopy,
  } = usePaymentTransfer();

  // Dynamic shipping and order total calculations
  const shippingFee = calculateShippingFee(
    subtotal,
    selectedGovernorate,
    freeShippingThreshold,
    governoratesShipping
  );
  const finalTotal = calculateOrderTotal(subtotal, shippingFee, discountAmount);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();

    const validationResult = checkoutFormSchema.safeParse({
      fullName,
      phone,
      alternatePhone,
      governorate: selectedGovernorate,
      city,
      address,
      vodafoneSenderPhone: paymentMethod === "vodafone_cash" ? vodafoneSenderPhone : undefined,
    });

    if (!validationResult.success) {
      const newErrors: CheckoutFormErrors = {};
      let firstInvalidNode: HTMLElement | null = null;

      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormErrors;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
          if (!firstInvalidNode) {
            if (field === "fullName") firstInvalidNode = fullNameRef.current;
            else if (field === "phone") firstInvalidNode = phoneRef.current;
            else if (field === "city") firstInvalidNode = cityRef.current;
            else if (field === "address") firstInvalidNode = addressRef.current;
            else if (field === "vodafoneSenderPhone") firstInvalidNode = vodafoneSenderRef.current;
          }
        }
      }

      setFormErrors(newErrors);
      toast.error("يرجى مراجعة واستكمال البيانات المحددة باللون الأحمر");
      if (firstInvalidNode) {
        firstInvalidNode.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalidNode.focus();
      }
      return;
    }

    setSubmitting(true);

    try {
      const orderNotesParts = [
        notes.trim(),
        paymentMethod === "instapay" && transferRef ? `تحويل إنستاباي: ${transferRef}` : "",
        paymentMethod === "vodafone_cash" && vodafoneSenderPhone ? `رقم محفظة العميل المحول منها: ${vodafoneSenderPhone}` : "",
      ].filter(Boolean);

      const orderData = {
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        governorate: selectedGovernorate,
        city: city.trim(),
        address: address.trim(),
        notes: orderNotesParts.join(" - "),
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          size: i.selectedSize,
          color: i.selectedColor.name,
          price: i.salePrice || i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        shippingFee,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        total: finalTotal,
      };

      const data = await api.orders.create(orderData);

      toast.success(`تم تأكيد طلبك بنجاح! شكراً لثقتك في ${STORE_DEFAULTS.storeName}.`);
      onOrderSuccess(data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "فشل في تأكيد الطلب، يرجى المحاولة مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}
