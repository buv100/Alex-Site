import { NextResponse } from "next/server";

export const GATE_COOKIE = "alex_admin_gate";

export function applyGateCookie(res: NextResponse) {
  const onHttps =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  res.cookies.set(GATE_COOKIE, "1", {
    httpOnly: true,
    secure: onHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
