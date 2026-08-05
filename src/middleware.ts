import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const GATE_COOKIE = "alex_admin_gate";

function isPublicSiteOnly() {
  if (process.env.PUBLIC_SITE_ONLY === "true") return true;
  if (process.env.ENABLE_ADMIN === "true") return false;
  if (process.env.VERCEL_ENV === "production") return true;
  return false;
}

function denyAdmin(req: { nextUrl: URL }) {
  const url = new URL(req.nextUrl.href);
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isPublicSiteOnly()) {
    return denyAdmin(req);
  }

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

  if (!pathname.startsWith("/admin/login")) {
    if (req.auth?.user?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
