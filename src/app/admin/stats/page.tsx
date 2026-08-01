"use client";

import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";

export default function AdminStatsPage() {
  const { properties, leads, adminLocale, resetDemoData } = useDemo();
  const t = getAdminDict(adminLocale);

  const active = properties.filter(
    (p) => p.status === "published" && !p.deletedAt,
  ).length;
  const archived = properties.filter(
    (p) =>
      (p.status === "sold" || p.status === "rented") && !p.deletedAt,
  ).length;
  const drafts = properties.filter((p) => p.status === "draft" && !p.deletedAt)
    .length;
  const byLeadStatus = {
    new: leads.filter((l) => l.status === "new").length,
    in_progress: leads.filter((l) => l.status === "in_progress").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  const rows = [
    { label: t.activeProperties, value: active },
    { label: t.archivedProperties, value: archived },
    { label: t.drafts, value: drafts },
    { label: t.totalLeads, value: leads.length },
    { label: t.newLeads, value: byLeadStatus.new },
    {
      label: adminLocale === "ru" ? "В работе" : "בטיפול",
      value: byLeadStatus.in_progress,
    },
    {
      label: adminLocale === "ru" ? "Закрыты" : "סגורות",
      value: byLeadStatus.closed,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-accent">{t.stats}</h1>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between rounded border border-border bg-bg-elevated px-4 py-3"
          >
            <span className="text-sm text-text-muted">{r.label}</span>
            <span className="text-2xl font-semibold">{r.value}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-danger w-full"
        onClick={() => {
          if (confirm("לאפס את נתוני הדמו?")) resetDemoData();
        }}
      >
        {adminLocale === "ru" ? "Сброс демо-данных" : "איפוס נתוני דמו"}
      </button>
    </div>
  );
}
