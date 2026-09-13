import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { requireAdminApi } from "@/lib/auth-guard";
import { handleApiError } from "@/lib/api-handler";

export async function POST(req: NextRequest) {
  const authError = await requireAdminApi(req);
  if (authError) return authError;

  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال أي ملف للرفع", code: "NO_FILE_PROVIDED" },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "نوع الملف غير مدعوم، يرجى رفع صورة فقط (JPG, PNG, WEBP)",
          code: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "حجم الصورة كبير جداً، الحد الأقصى هو 10 ميجابايت",
          code: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Cloudinary upload (Production Cloud Storage)
    if (isCloudinaryConfigured) {
      const result = await uploadToCloudinary(buffer, "giza86_products");
      return NextResponse.json({
        url: result.url,
        publicId: result.publicId,
        provider: "cloudinary",
      });
    }

    // Guard against ephemeral filesystem storage in serverless production
    const isServerlessOrProd =
      process.env.NODE_ENV === "production" ||
      Boolean(process.env.VERCEL) ||
      Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
      Boolean(process.env.AWS_EXECUTION_ENV);

    if (isServerlessOrProd) {
      return NextResponse.json(
        {
          error:
            "خدمة التخزين السحابي غير مهيأة في بيئة الإنتاج. يرجى ضبط بيانات Cloudinary في إعدادات البيئة (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) لضمان حفظ واستمرارية الصور.",
          code: "STORAGE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    console.warn(
      "[Upload Warning]: Cloudinary is not configured. Falling back to local storage (/public/uploads). Note: This is for local development only and will not persist in serverless production environments."
    );

    // 2. Local fallback storage (/public/uploads) for local development only
    const ext = path.extname(file.name) || ".jpg";
    const cleanFileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, cleanFileName), buffer);

    const fileUrl = `/uploads/${cleanFileName}`;
    return NextResponse.json({
      url: fileUrl,
      filename: cleanFileName,
      provider: "local",
    });
  } catch (error) {
    return handleApiError(error, "فشل في رفع الصورة، يرجى المحاولة مرة أخرى");
  }
}
