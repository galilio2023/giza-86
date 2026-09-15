import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getStoreSettings, updateStoreSettings } from "@/lib/data-service";
import { StoreSettingsItem } from "@/types";
import { updateSettingsSchema } from "@/lib/validations";
import { withAdminAuth, withErrorHandler } from "@/lib/api-handler";

/** Public endpoint to retrieve active store branding, shipping rates, and banner settings. */
export const GET = withErrorHandler(async () => {
  const settings = await getStoreSettings();
  return NextResponse.json(settings);
}, "فشل في جلب إعدادات المتجر");

/** Admin endpoint to update store configuration and purge layout caches. */
export const PATCH = withAdminAuth(async (request: Request) => {
  const rawBody = await request.json();
  const validated = updateSettingsSchema.parse(rawBody);

  const updated = await updateStoreSettings(validated as Partial<StoreSettingsItem>);
  revalidateTag("settings", "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(updated);
}, "فشل في تحديث إعدادات المتجر");

// Support both PUT and PATCH for update operations
export const PUT = PATCH;

