import Image from "next/image";
import { Package } from "lucide-react";
import { OrderItem } from "@/types";
import { formatEGP } from "@/lib/utils";

interface OrderItemsTableProps {
  items: OrderItem["items"];
  compact?: boolean;
  showVariantBadge?: boolean;
}

export function OrderItemsTable({
  items,
  compact = false,
  showVariantBadge = false,
}: OrderItemsTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-neutral-400">
        لا توجد منتجات مسجلة في هذا الطلب
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item, idx) => (
        <div
          key={item.id ? `item-${item.id}` : `item-idx-${idx}`}
          className={`flex items-center justify-between gap-3 ${
            compact ? "py-2.5 text-xs" : "py-3 first:pt-0"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {item.image ? (
              <div
                className={`relative rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 ${
                  compact ? "w-10 h-12" : "w-14 h-16"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes={compact ? "40px" : "56px"}
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={`rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-400 border border-neutral-200 ${
                  compact ? "w-10 h-12" : "w-14 h-16"
                }`}
              >
                <Package className={compact ? "w-4 h-4" : "w-5 h-5"} />
              </div>
            )}

            <div className="min-w-0">
              <h4 className="font-bold text-neutral-900 text-xs sm:text-sm truncate">
                {item.name}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                <span>
                  المقاس: <strong className="text-neutral-800">{item.size}</strong>
                </span>
                <span>•</span>
                <span>
                  اللون: <strong className="text-neutral-800">{item.color}</strong>
                </span>
                {showVariantBadge && item.variantId && (
                  <span className="text-[9px] bg-amber-50 text-amber-800 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200 mr-1">
                    Variant #{item.variantId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-left flex-shrink-0 text-xs sm:text-sm font-bold text-neutral-900">
            <span className="block">
              {formatEGP(item.price * item.quantity)}
            </span>
            <span className="text-[11px] text-neutral-400 font-normal block">
              {item.quantity} × {formatEGP(item.price)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
