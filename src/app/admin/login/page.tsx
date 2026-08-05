"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { siteConfig } from "@/lib/site";

const isProd = process.env.NODE_ENV === "production";

function AdminLoginForm() {
  const { loginAdmin, markAdminLoggedIn, adminLoggedIn, adminLocale } =
    useDemo();
  const t = getAdminDict(adminLocale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Strip access token from the address bar after the gate cookie is set (middleware).
  useEffect(() => {
    if (searchParams.get("access")) {
      router.replace("/admin/login");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (adminLoggedIn) router.replace("/admin");
  }, [adminLoggedIn, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isProd && loginAdmin(username, password)) {
      setLoading(false);
      router.push("/admin");
      return;
    }

    try {
      const result = await signIn("admin", {
        username,
        password,
        redirect: false,
      });

      if (result?.ok) {
        markAdminLoggedIn();
        setLoading(false);
        router.push("/admin");
        return;
      }

      setError("שם משתמש או סיסמה שגויים");
    } catch {
      setError("שם משתמש או סיסמה שגויים");
    }

    setLoading(false);
  }

  return (
    <div
      className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4"
      dir={t.dir}
    >
      <h1 className="font-display text-3xl text-accent">{t.login}</h1>
      <p className="mt-2 text-sm text-text-muted">{siteConfig.brandName}</p>
      <p className="mt-3 rounded border border-border bg-bg-elevated p-3 text-sm text-text-muted">
        כניסת מנהל לאלכס בלבד — <strong>אין צורך להירשם</strong>.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="field">
          <label htmlFor="adm-user">{t.username}</label>
          <input
            id="adm-user"
            autoComplete="username"
            inputMode="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="adm-pass">{t.password}</label>
          <input
            id="adm-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full min-h-12"
          disabled={loading}
        >
          {loading ? "…" : t.submitLogin}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-text-muted">
        אם נפתח דף הבית במקום מסך זה — פתחו את הקישור ב־Safari / Chrome (לא
        מתוך תצוגה מקדימה בוואטסאפ).
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-4">
          …
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
