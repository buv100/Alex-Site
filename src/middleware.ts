import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const DEV_SECRET = "dev-only-alex-nekasim-change-me-before-production";
const GATE_COOKIE = "alex_admin_gate";

function isPublicSiteOnly() {
  if (process.env.PUBLIC_SITE_ONLY === "true") return true;
  if (process.env.ENABLE_ADMIN === "true") return false;
  if (process.env.VERCEL_ENV === "production") return true;
  return false;
}

function denyAdmin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Production default: admin hidden unless ENABLE_ADMIN=true
  if (isPublicSiteOnly()) {
    return denyAdmin(req);
  }

  // Secret entry gate — without cookie / correct ?access=… the admin "does not exist"
  const entrySecret = process.env.ADMIN_ENTRY_SECRET?.trim();
  if (entrySecret) {
    const access = req.nextUrl.searchParams.get("access");
    const hasGate = req.cookies.get(GATE_COOKIE)?.value === "1";

    if (access && access === entrySecret) {
      const url = req.nextUrl.clone();
      url.searchParams.delete("access");
      if (!url.pathname.startsWith("/admin/login")) {
        url.pathname = "/admin/login";
      }
      const res = NextResponse.redirect(url);
      res.cookies.set(GATE_COOKIE, "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    if (!hasGate) {
      return denyAdmin(req);
    }
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
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
