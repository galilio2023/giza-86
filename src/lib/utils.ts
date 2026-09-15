import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEGP(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "0 ج.م";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 ج.م";
  return `${new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num)} ج.م`;
}

export function formatArabicDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timeHex = Date.now().toString(36).toUpperCase();
  const randomHex = Math.floor(100000 + Math.random() * 900000).toString(36).toUpperCase();
  return `EG-${year}-${timeHex}-${randomHex}`;
}

export function getErrorMessage(error: unknown, fallback = "حدث خطأ غير متوقع"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return fallback;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0621-\u064A0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Escapes SQL ILIKE / LIKE wildcard characters (% and _) in user queries
 */
export function sanitizeSearchQuery(query: string): string {
  return query.replace(/[%_\\]/g, "\\$&");
}

/**
 * Optimizes a Cloudinary image URL by injecting auto format and quality parameters (f_auto,q_auto)
 * if not already present. This dramatically reduces payload size (~85-90%) and prevents
 * upstream fetch timeouts during Next.js image optimization.
 */
export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.jpg";
  if (
    url.includes("res.cloudinary.com") &&
    url.includes("/image/upload/") &&
    !url.includes("/image/upload/f_") &&
    !url.includes("/image/upload/q_")
  ) {
    return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  }
  return url;
}


