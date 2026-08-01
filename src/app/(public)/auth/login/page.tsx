"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";

export default function LoginPage() {
  const { loginUser, currentUser } = useDemo();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) router.replace("/favorites");
  }, [currentUser, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = loginUser(phone, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/favorites");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl text-accent">התחברות</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="field">
          <label htmlFor="login-phone">טלפון</label>
          <input
            id="login-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="login-pass">סיסמה</label>
          <input
            id="login-pass"
            type="password"
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
        <button type="submit" className="btn btn-primary w-full">
          כניסה
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-text-muted">
        אין חשבון?{" "}
        <Link href="/auth/register" className="text-accent">
          הרשמה
        </Link>
      </p>
    </div>
  );
}
