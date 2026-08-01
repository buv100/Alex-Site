"use client";

import Link from "next/link";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import type { LeadStatus } from "@/lib/types";

const statusOptions: { value: LeadStatus; he: string; ru: string }[] = [
  { value: "new", he: "חדש", ru: "Новая" },
  { value: "in_progress", he: "בטיפול", ru: "В работе" },
  { value: "closed", he: "סגור", ru: "Закрыта" },
];

export default function AdminLeadsPage() {
  const { leads, updateLeadStatus, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-accent">{t.leads}</h1>
      {leads.length === 0 ? (
        <p className="text-text-muted">{t.noItems}</p>
      ) : (
        <ul className="space-y-3">
          {leads.map((l) => (
            <li
              key={l.id}
              className="rounded border border-border bg-bg-elevated p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <a href={`tel:${l.phone}`} className="text-accent">
                    {l.phone}
                  </a>
                  <p className="mt-1 text-xs text-text-muted">
                    {t.type}: {l.type}
                  </p>
                </div>
                <label className="sr-only" htmlFor={`lead-status-${l.id}`}>
                  {t.leadStatus}
                </label>
                <select
                  id={`lead-status-${l.id}`}
                  className="min-h-11 rounded border border-border bg-bg-soft px-2 text-sm"
                  value={l.status}
                  onChange={(e) =>
                    updateLeadStatus(l.id, e.target.value as LeadStatus)
                  }
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {adminLocale === "ru" ? o.ru : o.he}
                    </option>
                  ))}
                </select>
              </div>
              {l.message && (
                <p className="mt-2 text-sm text-text-muted">{l.message}</p>
              )}
              {l.propertyId && (
                <Link
                  href={`/properties/${l.propertyId}`}
                  className="mt-2 inline-block text-sm text-accent underline"
                >
                  {l.propertyTitle || l.propertyId}
                </Link>
              )}
              <p className="mt-2 text-xs text-text-muted/70">
                {new Date(l.createdAt).toLocaleString("he-IL")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
