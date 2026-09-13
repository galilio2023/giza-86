"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Star, Upload, Loader2, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { uploadImageFile } from "@/lib/upload-client";

interface ProductGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  onImageRemoved?: (removedUrl: string) => void;
}

const isDummyPlaceholder = (url: string) =>
  url.includes("photo-1583743814966-8936f5b7be1a");

export function ProductGalleryManager({
  images,
  onChange,
  onImageRemoved,
}: ProductGalleryManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = (newUrls: string[]) => {
    if (newUrls.length === 0) return;

    if (images.length === 1 && isDummyPlaceholder(images[0])) {
      onChange(newUrls);
    } else {
      const combined = [...images];
      for (const url of newUrls) {
        if (!combined.includes(url)) {
          combined.push(url);
        }
      }
      onChange(combined);
    }
  };

  const handleAddImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    addImages([trimmed]);
    setNewImageUrl("");
    toast.success("تمت إضافة رابط الصورة إلى المعرض");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageFile(file));
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map((r) => r.url);
      addImages(uploadedUrls);
      toast.success(
        files.length === 1
          ? "تم رفع الصورة بنجاح وإضافتها إلى المعرض"
          : `تم رفع ${files.length} صور بنجاح وإضافتها إلى المعرض`
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "فشل في رفع الصورة"));
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageFile(file));
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map((r) => r.url);
      addImages(uploadedUrls);
      toast.success(
        files.length === 1
          ? "تم رفع الصورة المسحوبة بنجاح"
          : `تم رفع ${files.length} صور مسحوبة بنجاح`
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "فشل في رفع الصور"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetCover = (indexToPromote: number) => {
    if (indexToPromote === 0 || indexToPromote >= images.length) return;
    const targetImage = images[indexToPromote];
    const remainingImages = images.filter((_, idx) => idx !== indexToPromote);
    onChange([targetImage, ...remainingImages]);
    toast.success("تم تعيين الصورة كغلاف رئيسي للمنتج ⭐");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedImages);
    if (onImageRemoved) {
      onImageRemoved(removedUrl);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
        isDragging
          ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/40"
          : "bg-neutral-50 border-neutral-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="font-bold text-neutral-800 flex items-center gap-1.5 text-xs sm:text-sm">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>معرض صور الموديل ({images.length} صور)</span>
        </label>
        <span className="text-[11px] text-neutral-500 font-medium">
          الصورة الأولى (#1) هي صورة الغلاف في المتجر
        </span>
      </div>

      {/* Empty State Dropzone */}
      {images.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-white/70 hover:bg-amber-50/40 rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-neutral-800 text-xs sm:text-sm">
              لم يتم إضافة صور للمنتج بعد
            </p>
            <p className="text-[11px] text-neutral-500">
              اضغط هنا لرفع الصور من جهازك، أو اسحب الملفات وأفلتها هنا مباشرة
            </p>
          </div>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-100/60 px-2.5 py-1 rounded-full mt-1">
            الصورة الأولى المرفوعة ستكون صورة الغلاف تلقائياً
          </span>
        </div>
      )}

      {/* Thumbnails grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              className={`relative aspect-3/4 rounded-xl overflow-hidden border bg-white group shadow-2xs transition ${
                idx === 0
                  ? "border-amber-500 ring-2 ring-amber-500/20"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />

              {/* Cover Badge */}
              {idx === 0 ? (
                <span className="absolute top-1.5 right-1.5 bg-amber-500 text-neutral-950 font-black text-[9px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1 z-10">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  الغلاف الرئيسي
                </span>
              ) : (
                /* Action: Set as cover */
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  className="absolute top-1.5 right-1.5 bg-neutral-900/80 hover:bg-amber-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 sm:opacity-90 sm:hover:opacity-100 transition flex items-center gap-1 z-10 cursor-pointer"
                  title="تعيين هذه الصورة كغلاف رئيسي"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  تعيين كغلاف
                </button>
              )}

              {/* Order Number Badge */}
              <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded z-10">
                #{idx + 1}
              </span>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute bottom-1.5 left-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-xs z-10"
                title="حذف الصورة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Add Image Actions */}
      <div className="space-y-2 pt-2 border-t border-neutral-200/80">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
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
            className="bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 font-bold text-xs gap-1.5 shadow-2xs cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>جاري رفع الصور...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-neutral-700" />
                <span>رفع صور من جهازك 📁</span>
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
              placeholder="أدخل رابط صورة خارجي (https://...)"
              className="p-2 rounded-xl border border-neutral-300 text-xs flex-1 bg-white font-mono text-left"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddImage}
              className="whitespace-nowrap font-bold text-xs cursor-pointer"
            >
              + إضافة رابط
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
