"use client";

import { useState } from "react";
import Image from "next/image";
import { Link2, Trash2 } from "lucide-react";
import { ProductColor } from "@/types";

interface ProductColorManagerProps {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
  availableImages: string[];
}

export function ProductColorManager({
  colors,
  onChange,
  availableImages,
}: ProductColorManagerProps) {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newColorImage, setNewColorImage] = useState("");

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    onChange([
      ...colors,
      {
        name: newColorName.trim(),
        hex: newColorHex,
        imageUrl: newColorImage.trim() || undefined,
      },
    ]);
    setNewColorName("");
    setNewColorHex("#000000");
    setNewColorImage("");
  };

  const handleRemoveColor = (hex: string) => {
    onChange(colors.filter((c) => c.hex !== hex));
  };

  const handleUpdateColorImage = (hex: string, imageUrl: string) => {
    onChange(
      colors.map((item) =>
        item.hex === hex ? { ...item, imageUrl: imageUrl || undefined } : item
      )
    );
  };

  return (
    <div className="space-y-3 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200">
      <div className="flex items-center justify-between">
        <label className="font-bold text-neutral-900 text-xs sm:text-sm flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-amber-600" />
          <span>الألوان المتاحة وربطها بصور الموديل ({colors.length} ألوان)</span>
        </label>
        <span className="text-[11px] text-neutral-500">
          عند اختيار العميل للون، تتبدل الصورة الرئيسية للون المختار تلقائياً
        </span>
      </div>

      {/* Added Colors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {colors.map((c) => (
          <div
            key={c.hex}
            className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 bg-white shadow-2xs gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-5 h-5 rounded-full border border-black/20 flex-shrink-0 shadow-2xs"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-xs font-bold text-neutral-900 truncate">{c.name}</span>
            </div>

            {/* Linked Image Selector */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {c.imageUrl && (
                <div className="relative w-7 h-9 rounded-md overflow-hidden border border-neutral-300 bg-neutral-100 flex-shrink-0">
                  <Image src={c.imageUrl} alt="" fill className="object-cover" />
                </div>
              )}
              <select
                value={c.imageUrl || ""}
                onChange={(e) => handleUpdateColorImage(c.hex, e.target.value)}
                className="text-base sm:text-[11px] p-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 max-w-[130px] truncate"
                title="اختر الصورة المربوطة بهذا اللون"
              >
                <option value="">بدون ربط صورة</option>
                {availableImages.map((img, i) => (
                  <option key={i} value={img}>
                    صورة {i + 1} {i === 0 ? "(الرئيسية)" : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleRemoveColor(c.hex)}
                className="text-neutral-400 hover:text-rose-600 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded transition-colors cursor-pointer"
                title="حذف اللون"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Color Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-neutral-200/80">
        <div className="sm:col-span-4">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder="اسم اللون الجديد (مثلاً: كحلي، بيج...)"
            className="w-full p-2.5 rounded-xl border border-neutral-200 text-base sm:text-xs bg-white"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-1.5">
          <input
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="w-full h-10 p-1 rounded-xl border border-neutral-200 cursor-pointer bg-white"
            title="اختر درجة اللون"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={newColorImage}
            onChange={(e) => setNewColorImage(e.target.value)}
            className="w-full h-10 p-2 rounded-xl border border-neutral-200 text-base sm:text-xs bg-white"
          >
            <option value="">ربط بصورة من المعرض (اختياري)</option>
            {availableImages.map((img, i) => (
              <option key={i} value={img}>
                صورة المعرض {i + 1} {i === 0 ? "★ (الرئيسية)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={handleAddColor}
            className="w-full h-9 bg-neutral-950 hover:bg-neutral-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            + إضافة
          </button>
        </div>
      </div>
    </div>
  );
}
