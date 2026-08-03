import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const DEV_SECRET = "dev-only-alex-nekasim-change-me-before-production";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only enforce NextAuth on admin when real production secrets exist.
  // Local demo uses client-side DemoProvider login.
  const serverAuthEnabled = Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_SECRET !== DEV_SECRET &&
      (process.env.ADMIN_PASSWORD ||
        process.env.ADMIN_PASSWORD_HASH ||
        process.env.MONGODB_URI),
  );

  if (
    serverAuthEnabled &&
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });
    if (!token || token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
