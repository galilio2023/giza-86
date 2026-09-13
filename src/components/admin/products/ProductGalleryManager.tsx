"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Star, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { uploadImageFile } from "@/lib/upload-client";

interface ProductGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  onImageRemoved?: (removedUrl: string) => void;
}

export function ProductGalleryManager({
  images,
  onChange,
  onImageRemoved,
}: ProductGalleryManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    onChange([...images, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadImageFile(file);
      onChange([...images, data.url]);
      toast.success("تم رفع الصورة بنجاح وإضافتها إلى المعرض");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "فشل في رفع الصورة"));
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length <= 1) {
      toast.error("يجب أن يحتوي المنتج على صورة واحدة على الأقل");
      return;
    }
    const removedUrl = images[indexToRemove];
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedImages);
    if (onImageRemoved) {
      onImageRemoved(removedUrl);
    }
  };

  return (
    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="font-bold text-neutral-800 flex items-center gap-1.5 text-xs sm:text-sm">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>معرض صور الموديل ({images.length} صور)</span>
        </label>
        <span className="text-[10px] text-neutral-400">
          الصورة الأولى هي صورة الغلاف في المتجر
        </span>
      </div>

      {/* Thumbnails list */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-3/4 rounded-xl overflow-hidden border border-neutral-200 bg-white group shadow-2xs"
          >
            <Image src={img} alt="" fill className="object-cover" />
            {idx === 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-neutral-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 z-10">
                <Star className="w-2.5 h-2.5 fill-current" />
                رئيسية
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute bottom-1 left-1 bg-rose-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-xs z-10"
              title="حذف الصورة"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload & Add Image Actions */}
      <div className="space-y-2 pt-1 border-t border-neutral-200/80">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Device Upload Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 font-bold text-xs gap-1.5 shadow-2xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>جاري رفع الصورة...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-neutral-700" />
                <span>رفع صورة من جهازك 📁</span>
              </>
            )}
          </Button>

          <span className="text-xs text-neutral-400 text-center sm:text-right">أو</span>

          {/* Image URL Input */}
          <div className="flex items-center gap-2 flex-1">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="أو أدخل رابط صورة خارجي (https://...)"
              className="p-2 rounded-xl border border-neutral-300 text-xs flex-1 bg-white font-mono text-left"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddImage}
              className="whitespace-nowrap font-bold text-xs"
            >
              + إضافة رابط
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
