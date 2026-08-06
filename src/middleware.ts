import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { applyGateCookie, GATE_COOKIE } from "@/lib/admin-gate";

const { auth } = NextAuth(authConfig);

function denyAdmin(req: { nextUrl: URL }) {
  const url = new URL(req.nextUrl.href);
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

function adminEnabled() {
  if (process.env.PUBLIC_SITE_ONLY === "true") return false;
  if (process.env.ENABLE_ADMIN === "true") return true;
  if (process.env.ADMIN_ENTRY_SECRET?.trim()) return true;
  if (process.env.VERCEL_ENV === "production") return false;
  return true;
}

function isLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!adminEnabled()) {
    return denyAdmin(req);
  }

  // Unlock route — sets gate cookie and redirects to login.
  if (pathname.startsWith("/admin/g/")) {
    return NextResponse.next();
  }

  const isAdminSession = req.auth?.user?.role === "admin";
  if (isAdminSession) {
    const res = NextResponse.next();
    applyGateCookie(res);
    return res;
  }

  // From here: not an authenticated admin.
  const entrySecret = process.env.ADMIN_ENTRY_SECRET?.trim();
  if (entrySecret) {
    const access = req.nextUrl.searchParams.get("access");
    const hasGate = req.cookies.get(GATE_COOKIE)?.value === "1";

    if (access && access === entrySecret) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      const res = NextResponse.redirect(url);
      applyGateCookie(res);
      return res;
    }

    if (!hasGate) {
      return denyAdmin(req);
    }
  }

  // Gate cookie (or no gate configured) only unlocks the login page —
  // never the rest of the admin UI without a real admin session.
  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/admin/:path*"],
};
