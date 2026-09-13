export interface UploadResult {
  url: string;
  provider: "cloudinary" | "local";
  publicId?: string;
  filename?: string;
}

/**
 * Shared client-side image uploader.
 * Validates mime-type and file size before transmitting to /api/upload.
 */
export async function uploadImageFile(file: File): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("حجم الصورة كبير جداً، الحد الأقصى هو 10 ميجابايت");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "فشل في رفع الصورة");
  }

  return res.json();
}
