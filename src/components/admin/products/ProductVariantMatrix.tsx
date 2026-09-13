"use client";

import React from "react";
import { Boxes } from "lucide-react";
import { ProductVariantItem } from "@/types";

export interface ProductVariantMatrixProps {
  variants: ProductVariantItem[];
  bulkStock: string;
  onBulkStockChange: (val: string) => void;
  onApplyBulkStock: () => void;
  onVariantStockChange: (index: number, stock: number) => void;
  onVariantSkuChange: (index: number, sku: string) => void;
}

export function ProductVariantMatrix({
  variants,
  bulkStock,
  onBulkStockChange,
  onApplyBulkStock,
  onVariantStockChange,
  onVariantSkuChange,
}: ProductVariantMatrixProps) {
  return (
    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-amber-600" />
          <h4 className="font-black text-neutral-900 text-xs">
            إدارة مخزون المتغيرات (المقاس × اللون)
          </h4>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
            {variants.length} متغير
          </span>
        </div>

        {/* Bulk Stock Input */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-600 font-bold whitespace-nowrap">
            تطبيق كمية موحدة:
          </span>
          <input
            type="number"
            min="0"
            value={bulkStock}
            onChange={(e) => onBulkStockChange(e.target.value)}
            className="w-16 p-1 text-center bg-white border border-neutral-300 rounded-lg text-base sm:text-xs font-mono font-bold"
            placeholder="10"
          />
          <button
            type="button"
            onClick={onApplyBulkStock}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            تطبيق على الكل
          </button>
        </div>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-6 text-neutral-400 text-xs">
          يرجى اختيار مقاس واحد ولون واحد على الأقل لإنشاء مصفوفة المخزون
        </div>
      ) : (
        <div className="max-h-56 overflow-y-auto overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-right text-xs min-w-[360px]">
            <thead className="bg-neutral-100/75 text-neutral-700 text-[11px] sticky top-0 font-bold z-10">
              <tr>
                <th className="p-2.5">اللون</th>
                <th className="p-2.5">المقاس</th>
                <th className="p-2.5">كود الصنف (SKU)</th>
                <th className="p-2.5 w-28">الكمية بالمخزن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {variants.map((v, idx) => (
                <tr key={`${v.size}-${v.colorName}-${idx}`} className="hover:bg-amber-50/30 transition-colors">
                  <td className="p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shadow-2xs"
                        style={{ backgroundColor: v.colorHex || "#ccc" }}
                      />
                      <span className="font-bold text-neutral-800">{v.colorName}</span>
                    </div>
                  </td>
                  <td className="p-2.5">
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded font-bold font-mono">
                      {v.size}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={v.sku || ""}
                      onChange={(e) => onVariantSkuChange(idx, e.target.value)}
                      className="w-full max-w-[180px] p-1 text-base sm:text-xs border border-neutral-200 rounded font-mono uppercase text-left"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => onVariantStockChange(idx, Number(e.target.value))}
                      className="w-20 p-1 text-base sm:text-xs border border-neutral-300 rounded font-mono font-bold text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
