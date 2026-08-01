"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";

export default function RegisterPage() {
  const { registerUser, currentUser } = useDemo();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) router.replace("/favorites");
  }, [currentUser, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = registerUser({ name, phone, password, privacyConsent: consent });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/favorites");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl text-accent">הרשמה מהירה</h1>
      <p className="mt-2 text-sm text-text-muted">
        פחות מחצי דקה — לשמירת נכסים מועדפים.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="field">
          <label htmlFor="reg-name">שם</label>
          <input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="reg-phone">טלפון</label>
          <input
            id="reg-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="reg-pass">סיסמה (לפחות 4 תווים)</label>
          <input
            id="reg-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>
        <label className="flex items-start gap-3 text-sm text-text-muted">
          <input
            type="checkbox"
            className="mt-1 size-5"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            מאשר/ת את{" "}
            <Link href="/privacy" className="text-accent underline">
              מדיניות פרטיות
            </Link>
          </span>
        </label>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full">
          יצירת חשבון
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-text-muted">
        כבר רשומים?{" "}
        <Link href="/auth/login" className="text-accent">
          התחברות
        </Link>
      </p>
    </div>
  );
}
