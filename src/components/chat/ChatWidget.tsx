"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME = `שלום! אני העוזר של ${siteConfig.brandName}. אפשר לשאול על דירות למכירה/השכרה, שכונות, או על אלכס.\nלעסקה ולמו״מ — עדיף וואטסאפ ישירות עם אלכס.`;

export function ChatWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextHistory.slice(0, -1),
        }),
      });
      const data = await res.json();
      const reply =
        typeof data.reply === "string"
          ? data.reply
          : "לא הצלחתי לענות כרגע. נסו שוב או פנו לאלכס בוואטסאפ.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "שגיאת רשת. נסו שוב או פנו לאלכס בוואטסאפ.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-50 flex flex-col items-start gap-3">
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="צ׳אט עזרה"
          className="pointer-events-auto flex h-[min(70dvh,520px)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded border border-border bg-bg-elevated shadow-2xl"
        >
          <header className="flex items-center justify-between gap-2 border-b border-border bg-bg-soft px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-accent">צ׳אט עזרה</p>
              <p className="text-[11px] text-text-muted">
                מידע מהאתר בלבד · לא מחליף את אלכס
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost min-h-10 px-3 text-sm"
              onClick={() => setOpen(false)}
            >
              סגור
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`max-w-[90%] whitespace-pre-wrap rounded px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ms-auto bg-accent text-[#1a1510]"
                    : "me-auto bg-bg-soft text-text"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <p className="text-xs text-text-muted" role="status">
                חושב…
              </p>
            )}
          </div>

          <form
            className="flex gap-2 border-t border-border p-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              הודעה לצ׳אט
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              className="min-h-11 flex-1 rounded border border-border bg-bg px-3 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="שאלו על דירה או על אלכס…"
              maxLength={800}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary min-h-11 px-3 text-sm"
              disabled={loading || !input.trim()}
            >
              שלח
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="pointer-events-auto btn btn-primary min-h-12 rounded-full px-5 shadow-lg"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "סגור צ׳אט" : "צ׳אט עזרה"}
      </button>
    </div>
  );
}
