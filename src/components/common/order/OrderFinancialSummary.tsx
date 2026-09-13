import { formatEGP } from "@/lib/utils";

interface OrderFinancialSummaryProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  compact?: boolean;
}

export function OrderFinancialSummary({
  subtotal,
  shippingFee,
  discount,
  total,
  couponCode,
  compact = false,
}: OrderFinancialSummaryProps) {
  return (
    <div
      className={`border-t border-neutral-200 text-xs ${
        compact ? "pt-3 space-y-1.5" : "pt-4 space-y-2"
      }`}
    >
      <div className="flex justify-between text-neutral-600">
        <span>المجموع الفرعي:</span>
        <span className="font-bold text-neutral-900">{formatEGP(subtotal)}</span>
      </div>

      <div className="flex justify-between text-neutral-600">
        <span>مصاريف الشحن والتوصيل:</span>
        <span className="font-bold text-neutral-900">
          {shippingFee === 0 ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              شحن مجاني
            </span>
          ) : (
            formatEGP(shippingFee)
          )}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-emerald-700 font-bold">
          <span className="flex items-center gap-1.5">
            <span>الخصم</span>
            {couponCode && (
              <span className="text-[10px] font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {couponCode}
              </span>
            )}
            :
          </span>
          <span>-{formatEGP(discount)}</span>
        </div>
      )}

      <div
        className={`border-t border-neutral-200 flex justify-between font-black text-neutral-900 ${
          compact ? "pt-2 text-sm" : "pt-3 text-base"
        }`}
      >
        <span>المبلغ المستحق للدفع:</span>
        <span className="text-amber-700 text-lg font-black">{formatEGP(total)}</span>
      </div>
    </div>
  );
}
