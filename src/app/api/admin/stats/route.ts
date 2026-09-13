import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/data-service";
import { requireAdminApi } from "@/lib/auth-guard";

export async function GET(request: Request) {
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error("Dashboard stats error:", error);
    const message = error instanceof Error ? error.message : "فشل في جلب إحصائيات لوحة التحكم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
