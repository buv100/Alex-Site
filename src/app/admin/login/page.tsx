"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { DEMO_ADMIN, siteConfig } from "@/lib/site";

export default function AdminLoginPage() {
  const { loginAdmin, adminLoggedIn, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (adminLoggedIn) router.replace("/admin");
  }, [adminLoggedIn, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = loginAdmin(username, password);
    if (!ok) {
      setError(true);
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4" dir={t.dir}>
      <h1 className="font-display text-3xl text-accent">{t.login}</h1>
      <p className="mt-2 text-sm text-text-muted">{siteConfig.brandName}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="field">
          <label htmlFor="adm-user">{t.username}</label>
          <input
            id="adm-user"
            autoComplete="username"
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
            שם משתמש או סיסמה שגויים
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full">
          {t.submitLogin}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-text-muted">
        דמו: {DEMO_ADMIN.username} / {DEMO_ADMIN.password}
      </p>
    </div>
  );
}
