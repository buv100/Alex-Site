import { NextResponse } from "next/server";
import { buildChatContext } from "@/lib/chat/context";
import { answerWithOptionalLlm } from "@/lib/chat/answer";

type Msg = { role: "user" | "assistant"; content: string };

const globalRate = globalThis as unknown as {
  alexChatRate?: Map<string, { count: number; resetAt: number }>;
};

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimit(ip: string, limit = 30, windowMs = 60 * 60 * 1000) {
  if (!globalRate.alexChatRate) globalRate.alexChatRate = new Map();
  const now = Date.now();
  const cur = globalRate.alexChatRate.get(ip);
  if (!cur || now > cur.resetAt) {
    globalRate.alexChatRate.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (cur.count >= limit) return false;
  cur.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "too_many_requests", reply: "הגעת למכסת השאלות לשעה. נסו שוב מאוחר יותר, או פנו לאלכס בוואטסאפ." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const message = String(body?.message ?? "").trim();
    const history = (Array.isArray(body?.history) ? body.history : []) as Msg[];

    if (!message || message.length > 800) {
      return NextResponse.json({ error: "invalid_message" }, { status: 400 });
    }

    const safeHistory = history
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length < 2000,
      )
      .slice(-8);

    const ctx = await buildChatContext();
    const { reply, mode } = await answerWithOptionalLlm(
      message,
      safeHistory,
      ctx,
    );

    return NextResponse.json({ reply, mode });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "failed",
        reply: "משהו השתבש. אפשר לנסות שוב או ליצור קשר עם אלכס בוואטסאפ.",
      },
      { status: 500 },
    );
  }
}
