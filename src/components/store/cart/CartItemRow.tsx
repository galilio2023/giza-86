import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { formatEGP } from "@/lib/utils";

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartItemRowProps) {
  const itemPrice = item.salePrice || item.price;

  if (compact) {
    return (
      <div className="p-4 sm:p-5 flex gap-3.5 sm:gap-4 items-center">
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <Link
            href={`/products/${item.productId}`}
            className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-800 transition truncate block"
          >
            {item.name}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <span className="bg-neutral-100 px-2 py-0.5 rounded font-bold">{item.selectedSize}</span>
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: item.selectedColor.hex }}
              />
              {item.selectedColor.name}
            </span>
          </div>
          <div className="text-xs font-black text-neutral-900 font-mono">
            {formatEGP(itemPrice * item.quantity)}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-neutral-400 hover:text-rose-600 p-1 transition cursor-pointer"
            aria-label="حذف المنتج من السلة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-neutral-200 transition cursor-pointer"
              aria-label="تقليل الكمية"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold font-mono">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-neutral-200 transition cursor-pointer"
              aria-label="زيادة الكمية"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex gap-4 items-center">
      <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 rounded-2xl overflow-hidden shrink-0">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <Link
          href={`/products/${item.productId}`}
          className="text-sm sm:text-base font-bold text-neutral-900 hover:text-amber-800 transition line-clamp-1"
        >
          {item.name}
        </Link>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="bg-neutral-100 px-2 py-0.5 rounded-md font-bold text-neutral-800">
            المقاس: {item.selectedSize}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-black/10 inline-block"
              style={{ backgroundColor: item.selectedColor.hex }}
            />
            <span>{item.selectedColor.name}</span>
          </span>
        </div>
        <div className="text-sm font-black text-neutral-900 pt-1 font-mono">
          {formatEGP(itemPrice * item.quantity)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6 shrink-0">
        {/* Quantity Counter */}
        <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-2 hover:bg-neutral-200 text-neutral-700 transition cursor-pointer"
            aria-label="تقليل الكمية"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-black font-mono text-neutral-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-2 hover:bg-neutral-200 text-neutral-700 transition cursor-pointer"
            aria-label="زيادة الكمية"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          title="حذف من السلة"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
