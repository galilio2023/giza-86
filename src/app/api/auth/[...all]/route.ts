import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { isDatabaseConfigured } from "@/db";
import { NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { message: "Better Auth running in demo/fallback mode without database." },
      { status: 200 }
    );
  }
  return handlers.GET(req);
};

export const POST = async (req: Request) => {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { message: "Better Auth running in demo/fallback mode without database." },
      { status: 200 }
    );
  }
  return handlers.POST(req);
};
