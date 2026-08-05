"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormPrivacyNotice } from "@/components/forms/FormPrivacyNotice";
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
    setError("");
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
      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4"
        noValidate
        aria-describedby="reg-privacy-notice"
      >
        <FormPrivacyNotice purpose="register" id="reg-privacy-notice" />
        <div className="field">
          <label htmlFor="reg-name">
            שם <span aria-hidden="true">*</span>
            <span className="sr-only"> (שדה חובה)</span>
          </label>
          <input
            id="reg-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "reg-error" : undefined}
          />
        </div>
        <div className="field">
          <label htmlFor="reg-phone">
            טלפון <span aria-hidden="true">*</span>
            <span className="sr-only"> (שדה חובה)</span>
          </label>
          <input
            id="reg-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "reg-error" : undefined}
          />
        </div>
        <div className="field">
          <label htmlFor="reg-pass">
            סיסמה (לפחות 4 תווים) <span aria-hidden="true">*</span>
            <span className="sr-only"> (שדה חובה)</span>
          </label>
          <input
            id="reg-pass"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "reg-error" : undefined}
          />
        </div>
        <label className="flex items-start gap-3 text-sm text-text-muted">
          <input
            type="checkbox"
            className="mt-1 size-5"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(error && !consent)}
            aria-describedby={error ? "reg-error" : undefined}
          />
          <span>
            מאשר/ת את{" "}
            <Link href="/privacy" className="text-accent underline">
              מדיניות הפרטיות
            </Link>
            {" "}ומסירת הפרטים מרצוני החופשי.
          </span>
        </label>
        {error && (
          <p id="reg-error" className="text-sm text-danger" role="alert">
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
