import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const GATE_COOKIE = "alex_admin_gate";

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

function adminEnabled() {
  if (process.env.PUBLIC_SITE_ONLY === "true") return false;
  if (process.env.ENABLE_ADMIN === "true") return true;
  // If an entry secret exists, allow unlock via that secret even when
  // ENABLE_ADMIN was mis-set — otherwise only local/dev works.
  if (process.env.ADMIN_ENTRY_SECRET?.trim()) return true;
  if (process.env.VERCEL_ENV === "production") return false;
  return true;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!adminEnabled()) {
    return denyAdmin(req);
  }

  const entrySecret = process.env.ADMIN_ENTRY_SECRET?.trim();
  if (entrySecret) {
    const access = req.nextUrl.searchParams.get("access");
    const hasGate = req.cookies.get(GATE_COOKIE)?.value === "1";

    // Path unlock: /admin/g/<secret> — survives WhatsApp better than ?access=
    const pathUnlock = pathname.match(/^\/admin\/g\/([^/]+)\/?$/);
    const pathToken = pathUnlock?.[1] ? decodeURIComponent(pathUnlock[1]) : null;

    const tokenOk =
      (access && access === entrySecret) ||
      (pathToken && pathToken === entrySecret);

    if (tokenOk) {
      // Serve login on this 200 response + set cookie (no 302 — mobile-safe)
      if (pathname !== "/admin/login") {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.search = "";
        const res = NextResponse.rewrite(url);
        setGateCookie(res);
        return res;
      }
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
