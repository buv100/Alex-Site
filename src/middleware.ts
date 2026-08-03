import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const DEV_SECRET = "dev-only-alex-nekasim-change-me-before-production";

function isPublicSiteOnly() {
  // Public live link: no admin UI for visitors
  if (process.env.PUBLIC_SITE_ONLY === "true") return true;
  if (process.env.ENABLE_ADMIN === "true") return false;
  // Default on Vercel production: public-only unless ENABLE_ADMIN=true
  if (process.env.VERCEL_ENV === "production") return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && isPublicSiteOnly()) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

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
