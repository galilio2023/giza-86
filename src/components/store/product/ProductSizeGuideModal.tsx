"use client";

import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductSizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIZE_GUIDE_ROWS = [
  { size: "S", chest: "52 سم", length: "70 سم", weight: "55 - 65 كجم" },
  { size: "M", chest: "55 سم", length: "72 سم", weight: "65 - 75 كجم" },
  { size: "L", chest: "58 سم", length: "74 سم", weight: "75 - 85 كجم" },
  { size: "XL", chest: "62 سم", length: "76 سم", weight: "85 - 95 كجم" },
  { size: "2XL", chest: "66 سم", length: "78 سم", weight: "95 - 110 كجم" },
  { size: "3XL", chest: "70 سم", length: "80 سم", weight: "110 - 125 كجم" },
];

export function ProductSizeGuideModal({ open, onOpenChange }: ProductSizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-600" />
            <DialogTitle>جدول المقاسات بالسنتيمتر (cm)</DialogTitle>
          </div>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-neutral-100 text-neutral-800">
                <th className="p-2.5 font-bold border border-neutral-200">المقاس</th>
                <th className="p-2.5 font-bold border border-neutral-200">عرض الصدر</th>
                <th className="p-2.5 font-bold border border-neutral-200">الطول الكلي</th>
                <th className="p-2.5 font-bold border border-neutral-200">الوزن المناسب</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              {SIZE_GUIDE_ROWS.map((row) => (
                <tr key={row.size}>
                  <td className="p-2.5 font-bold border border-neutral-200 bg-neutral-50">{row.size}</td>
                  <td className="p-2.5 border border-neutral-200">{row.chest}</td>
                  <td className="p-2.5 border border-neutral-200">{row.length}</td>
                  <td className="p-2.5 border border-neutral-200">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-neutral-500">
          * جميع المقاسات تخضع لنسبة تفاوت طبيعية ±1 سم. في حال الحيرة بين مقاسين ننصح باختيار المقاس الأكبر لراحة أكبر.
        </p>

        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onOpenChange(false)}
        >
          فهمت، إغلاق الجدول
        </Button>
      </DialogContent>
    </Dialog>
  );
}
