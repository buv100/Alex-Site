"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { DEMO_ADMIN } from "@/lib/site";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const {
    adminLoggedIn,
    adminLocale,
    setAdminLocale,
    logoutAdmin,
    ready,
    serverMode,
  } = useDemo();
  const { data: session, status } = useSession();
  const t = getAdminDict(adminLocale);
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const isAdminSession = session?.user?.role === "admin";
  const allowed = adminLoggedIn || isAdminSession;

  useEffect(() => {
    if (!ready || isLogin) return;
    if (status === "loading") return;
    if (!allowed) router.replace("/admin/login");
  }, [ready, allowed, isLogin, router, status]);

  async function onLogout() {
    logoutAdmin();
    await signOut({ redirect: false });
    router.replace("/admin/login");
  }

  if (!ready || (!isLogin && status === "loading" && !adminLoggedIn)) {
    return <p className="p-6 text-text-muted">…</p>;
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (!allowed) {
    return <p className="p-6 text-text-muted">…</p>;
  }

  const nav = [
    { href: "/admin", label: t.dashboard },
    { href: "/admin/properties", label: t.properties },
    { href: "/admin/leads", label: t.leads },
    { href: "/admin/stats", label: t.stats },
  ];

  return (
    <div className="min-h-dvh bg-bg" dir={t.dir} lang={adminLocale}>
      <header className="sticky top-0 z-40 border-b border-border bg-bg-elevated/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-3 py-3">
          <p className="text-sm font-semibold text-accent">{t.brandAdmin}</p>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="admin-lang">
              {t.language}
            </label>
            <select
              id="admin-lang"
              className="min-h-11 rounded border border-border bg-bg-soft px-2 text-sm"
              value={adminLocale}
              onChange={(e) => setAdminLocale(e.target.value as "he" | "ru")}
            >
              <option value="he">עברית</option>
              <option value="ru">Русский</option>
            </select>
            <button
              type="button"
              className="btn btn-ghost min-h-11 px-3 text-sm"
              onClick={onLogout}
            >
              {t.logout}
            </button>
          </div>
        </div>
        <nav
          className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 pb-2"
          aria-label="Admin"
        >
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-11 shrink-0 rounded px-3 py-2 text-sm ${
                  active ? "bg-accent text-[#1a1510]" : "text-text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="min-h-11 shrink-0 px-3 py-2 text-sm text-text-muted"
          >
            {t.viewSite}
          </Link>
        </nav>
      </header>
      {!serverMode && (
        <div
          className="border-b border-accent/40 bg-accent-dim px-3 py-3 text-sm text-text"
          role="status"
        >
          {adminLocale === "ru"
            ? "Режим демо: объекты сохраняются в браузере этого телефона. Для общего сервера нужны MongoDB + Cloudinary."
            : "מצב דמו: נכסים ופניות נשמרים בדפדפן של הטלפון הזה בלבד. לשמירה משותפת בשרת — חיבור MongoDB + Cloudinary."}
        </div>
      )}
      <main className="mx-auto max-w-3xl px-3 py-5">{children}</main>
      {process.env.NODE_ENV !== "production" && (
        <p className="pb-8 text-center text-xs text-text-muted/50">
          demo: {DEMO_ADMIN.username} / {DEMO_ADMIN.password}
        </p>
      )}
    </div>
  );
}
