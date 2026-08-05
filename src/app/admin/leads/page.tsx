"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { clientWhatsAppUrl, telHref } from "@/lib/phone";
import { leadReplyMessage } from "@/lib/whatsapp";
import type { LeadStatus, LeadType } from "@/lib/types";

const statusOptions: { value: LeadStatus; he: string; ru: string }[] = [
  { value: "new", he: "חדש", ru: "Новая" },
  { value: "in_progress", he: "בטיפול", ru: "В работе" },
  { value: "closed", he: "סגור", ru: "Закрыта" },
];

export default function AdminLeadsPage() {
  const { leads, updateLeadStatus, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");

  const typeLabel = (type: LeadType) => {
    if (type === "property") return t.leadTypeProperty;
    if (type === "seller") return t.leadTypeSeller;
    return t.leadTypeGeneral;
  };

  const list = useMemo(() => {
    const sorted = [...leads].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (filter === "all") return sorted;
    return sorted.filter((l) => l.status === filter);
  }, [leads, filter]);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-accent">{t.leads}</h1>

      <div className="field">
        <label htmlFor="filter-leads">{t.filterLeads}</label>
        <select
          id="filter-leads"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">{t.allLeads}</option>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {adminLocale === "ru" ? o.ru : o.he}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="text-text-muted">{t.noItems}</p>
      ) : (
        <ul className="space-y-3">
          {list.map((l) => {
            const wa = clientWhatsAppUrl(
              l.phone,
              leadReplyMessage({
                name: l.name,
                propertyTitle: l.propertyTitle,
              }),
            );
            return (
              <li
                key={l.id}
                className="rounded border border-border bg-bg-elevated p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-sm text-accent">{l.phone}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t.type}: {typeLabel(l.type)}
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

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={telHref(l.phone)}
                    className="btn btn-primary min-h-12 text-sm"
                    onClick={() => {
                      if (l.status === "new") updateLeadStatus(l.id, "in_progress");
                    }}
                  >
                    {t.call}
                  </a>
                  {wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost min-h-12 text-sm"
                      onClick={() => {
                        if (l.status === "new")
                          updateLeadStatus(l.id, "in_progress");
                      }}
                    >
                      {t.whatsappClient}
                    </a>
                  ) : (
                    <span className="btn btn-ghost min-h-12 cursor-not-allowed text-sm opacity-40">
                      {t.whatsappClient}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-text-muted/70">
                  {new Date(l.createdAt).toLocaleString("he-IL")}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
