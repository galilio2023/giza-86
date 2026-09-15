"use client";

import { useState } from "react";
import { toast } from "sonner";

export interface UsePaymentTransferReturn {
  transferRef: string;
  setTransferRef: (ref: string) => void;
  vodafoneSenderPhone: string;
  setVodafoneSenderPhone: (phone: string) => void;
  copiedInstapay: boolean;
  copiedVodafone: boolean;
  handleCopy: (text: string, type: "instapay" | "vodafone") => void;
}

/** Manages transfer references, wallet sender numbers, and clipboard copy states for InstaPay and Vodafone Cash. */
export function usePaymentTransfer(): UsePaymentTransferReturn {
  const [transferRef, setTransferRef] = useState("");
  const [vodafoneSenderPhone, setVodafoneSenderPhone] = useState("");
  const [copiedInstapay, setCopiedInstapay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);

  const handleCopy = (text: string, type: "instapay" | "vodafone") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === "instapay") {
      setCopiedInstapay(true);
      setTimeout(() => setCopiedInstapay(false), 3000);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 3000);
    }
    toast.success("تم نسخ الرقم/المعرف بنجاح!");
  };

  return {
    transferRef,
    setTransferRef,
    vodafoneSenderPhone,
    setVodafoneSenderPhone,
    copiedInstapay,
    copiedVodafone,
    handleCopy,
  };
}
