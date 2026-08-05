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

function setGateCookie(res: NextResponse) {
  const onHttps =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  res.cookies.set(GATE_COOKIE, "1", {
    httpOnly: true,
    secure: onHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
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

    // Valid token: serve the page on THIS response (200) and set the cookie.
    // Mobile / in-app browsers often drop Set-Cookie on 302 redirects.
    if (access && access === entrySecret) {
      const res = NextResponse.next();
      setGateCookie(res);
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
