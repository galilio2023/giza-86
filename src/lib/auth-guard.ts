import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured } from "@/db";

export interface AdminAuthResult {
  isAdmin: boolean;
  user: {
    id: string;
    email?: string;
    name?: string;
    role?: string | null;
  } | null;
}

/**
 * Validates whether the incoming request belongs to an authenticated administrator.
 * Supports both API Route Requests and Server Components.
 */
export async function validateAdminSession(requestHeaders?: Headers): Promise<AdminAuthResult> {
  if (!isDatabaseConfigured) {
    return { isAdmin: false, user: null };
  }

  try {
    const h = requestHeaders ? requestHeaders : await headers();
    const session = await auth.api.getSession({ headers: h });

    if (!session || !session.user) {
      return { isAdmin: false, user: null };
    }

    const role = (session.user as { role?: string }).role;
    const email = session.user.email?.toLowerCase();

    const configuredAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase()?.trim();
    // Grant admin access if role is "admin" or if it matches the configured admin email
    const isAdmin = role === "admin" || (Boolean(configuredAdminEmail) && email === configuredAdminEmail);

    return {
      isAdmin,
      user: session.user,
    };
  } catch (error) {
    console.error("Failed to validate admin session:", error);
    return { isAdmin: false, user: null };
  }
}

/**
 * Route Handler Guard for API endpoints.
 * Returns null if authorized, or a 401/403 NextResponse if unauthorized.
 */
export async function requireAdminApi(request: Request): Promise<NextResponse | null> {
  const { isAdmin, user } = await validateAdminSession(request.headers);

  if (!isAdmin) {
    const status = user ? 403 : 401;
    const errorMsg = user
      ? "غير مصرح لك بالوصول: حسابك لا يملك صلاحيات مدير النظام (Forbidden - Admin role required)."
      : "يرجى تسجيل الدخول أولاً للوصول إلى لوحة الإدارة (Unauthorized - Authentication required).";

    return NextResponse.json(
      {
        error: errorMsg,
      },
      { status }
    );
  }

  return null;
}

/**
 * Server Component Guard for admin pages.
 * Redirects to /admin/login immediately on the server if not authenticated.
 */
export async function requireAdminServer(): Promise<AdminAuthResult> {
  const { redirect } = await import("next/navigation");
  const result = await validateAdminSession();
  if (!result.isAdmin) {
    redirect("/admin/login");
  }
  return result;
}
