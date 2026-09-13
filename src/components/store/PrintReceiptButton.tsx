"use client";

import { Printer } from "lucide-react";

interface PrintReceiptButtonProps {
  className?: string;
}

export function PrintReceiptButton({ className = "" }: PrintReceiptButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-bold px-5 py-3 rounded-xl text-xs transition-all duration-200 shadow-xs cursor-pointer active:scale-95 print:hidden ${className}`}
      title="طباعة إيصال الطلب أو حفظ كملف PDF"
    >
      <Printer className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span>طباعة إيصال الطلب (PDF)</span>
    </button>
  );
}
