import { NextResponse } from "next/server";
import { applyGateCookie } from "@/lib/admin-gate";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };

export async function GET(request: Request, context: Ctx) {
  const { token } = await context.params;
  const secret = process.env.ADMIN_ENTRY_SECRET?.trim();
  const base = new URL(request.url);

  if (!secret || decodeURIComponent(token) !== secret) {
    return NextResponse.redirect(new URL("/", base));
  }

  const res = NextResponse.redirect(new URL("/admin/login", base));
  applyGateCookie(res);
  return res;
}
