"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export interface UseCouponApplyOptions {
  onCouponApplied?: (code: string, discount: number) => void;
}

export interface UseCouponApplyReturn {
  couponCode: string;
  setCouponCode: (code: string) => void;
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string | null) => void;
  couponLoading: boolean;
  handleApplyCoupon: (e: FormEvent, subtotal: number) => Promise<boolean>;
  resetCoupon: () => void;
}

/** Handles promotional coupon code validation, discount state, and toast feedback. */
export function useCouponApply(options: UseCouponApplyOptions = {}): UseCouponApplyReturn {
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const resetCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setAppliedCoupon(null);
  };

  const handleApplyCoupon = async (e: FormEvent, subtotal: number): Promise<boolean> => {
    e.preventDefault();
    if (!couponCode.trim()) return false;

    setCouponLoading(true);
    try {
      const res = await api.coupons.validate({ code: couponCode, subtotal });
      if (res.valid) {
        setDiscountAmount(res.discount);
        const upperCode = couponCode.toUpperCase();
        setAppliedCoupon(upperCode);
        toast.success(res.message);
        options.onCouponApplied?.(upperCode, res.discount);
        return true;
      } else {
        toast.error(res.message || "كوبون الخصم غير صالح");
        return false;
      }
    } catch {
      toast.error("فشل في التحقق من الكوبون حالياً");
      return false;
    } finally {
      setCouponLoading(false);
    }
  };

  return {
    couponCode,
    setCouponCode,
    discountAmount,
    setDiscountAmount,
    appliedCoupon,
    setAppliedCoupon,
    couponLoading,
    handleApplyCoupon,
    resetCoupon,
  };
}
