"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import type { LeadType } from "@/lib/types";

interface Props {
  type: LeadType;
  propertyId?: string | null;
  propertyTitle?: string | null;
  propertyUrl?: string | null;
  title?: string;
}

export function LeadForm({
  type,
  propertyId = null,
  propertyTitle = null,
  propertyUrl = null,
  title = "השאירו פרטים — אלכס יחזור אליכם",
}: Props) {
  const { addLead } = useDemo();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("נא למלא שם ומספר טלפון");
      return;
    }
    if (!consent) {
      setError("יש לאשר את מדיניות הפרטיות");
      return;
    }
    addLead({
      type,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim() || null,
      propertyId,
      propertyTitle,
      propertyUrl,
      privacyConsentAt: new Date().toISOString(),
    });
    setDone(true);
    setName("");
    setPhone("");
    setMessage("");
    setConsent(false);
  }

  if (done) {
    return (
      <div
        className="rounded border border-success/40 bg-success/10 p-4 text-sm"
        role="status"
      >
        הפנייה נשלחה. אלכס יחזור אליכם בהקדם.
        <button
          type="button"
          className="mt-3 block text-accent underline"
          onClick={() => setDone(false)}
        >
          שליחה נוספת
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <h3 className="font-display text-xl text-accent">{title}</h3>
      <div className="field">
        <label htmlFor={`lead-name-${type}`}>שם מלא</label>
        <input
          id={`lead-name-${type}`}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor={`lead-phone-${type}`}>טלפון</label>
        <input
          id={`lead-phone-${type}`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor={`lead-msg-${type}`}>הודעה (אופציונלי)</label>
        <textarea
          id={`lead-msg-${type}`}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-text-muted">
        <input
          type="checkbox"
          className="mt-1 size-5 shrink-0"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          אני מאשר/ת כי הפרטים שמסרתי ייאספו ויעובדו בהתאם ל
          <Link href="/privacy" className="text-accent underline">
            מדיניות הפרטיות
          </Link>
          . מסירת המידע מרצוני החופשי.
        </span>
      </label>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        שליחה
      </button>
    </form>
  );
}
