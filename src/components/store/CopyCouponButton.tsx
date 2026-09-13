"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyCouponButtonProps {
  code: string;
}

export function CopyCouponButton({ code }: CopyCouponButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`تم نسخ كود الخصم ${code} إلى الحافظة!`);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Button
      variant="amber"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-950" />
          <span>تم النسخ!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>انسخ الكود</span>
        </>
      )}
    </Button>
  );
}
