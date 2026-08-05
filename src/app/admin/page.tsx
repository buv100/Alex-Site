"use client";

import Link from "next/link";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { statusLabelHe } from "@/lib/format";
import { clientWhatsAppUrl, telHref } from "@/lib/phone";
import { leadReplyMessage } from "@/lib/whatsapp";

export default function AdminDashboardPage() {
  const { properties, leads, updateLeadStatus, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const active = properties.filter(
    (p) => p.status === "published" && !p.deletedAt,
  ).length;
  const drafts = properties.filter((p) => p.status === "draft" && !p.deletedAt)
    .length;
  const newLeads = leads.filter((l) => l.status === "new");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-accent">{t.dashboard}</h1>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/admin/properties"
          className="rounded border border-border bg-bg-elevated p-4"
        >
          <p className="text-xs text-text-muted">{t.activeProperties}</p>
          <p className="mt-1 text-3xl font-semibold">{active}</p>
        </Link>
        <Link
          href="/admin/properties"
          className="rounded border border-border bg-bg-elevated p-4"
        >
          <p className="text-xs text-text-muted">{t.drafts}</p>
          <p className="mt-1 text-3xl font-semibold">{drafts}</p>
        </Link>
        <Link
          href="/admin/leads"
          className="col-span-2 rounded border border-accent/40 bg-accent-dim p-4"
        >
          <p className="text-xs text-accent">{t.newLeads}</p>
          <p className="mt-1 text-3xl font-semibold text-accent">{newLeads.length}</p>
        </Link>
      </div>

      <Link href="/admin/properties/new" className="btn btn-primary w-full min-h-14 text-base">
        {t.newProperty}
      </Link>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">{t.newLeads}</h2>
          <Link href="/admin/leads" className="text-sm text-accent">
            {t.leads}
          </Link>
        </div>
        {newLeads.length === 0 ? (
          <p className="text-sm text-text-muted">{t.noItems}</p>
        ) : (
          <ul className="space-y-3">
            {newLeads.slice(0, 5).map((l) => {
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
                  className="rounded border border-border bg-bg-elevated p-3"
                >
                  <p className="font-medium">{l.name}</p>
                  <p className="text-sm text-text-muted">{l.phone}</p>
                  {l.propertyTitle && (
                    <p className="text-xs text-accent">{l.propertyTitle}</p>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={telHref(l.phone)}
                      className="btn btn-primary min-h-11 text-sm"
                      onClick={() => updateLeadStatus(l.id, "in_progress")}
                    >
                      {t.call}
                    </a>
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost min-h-11 text-sm"
                        onClick={() => updateLeadStatus(l.id, "in_progress")}
                      >
                        {t.whatsappClient}
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">{t.properties}</h2>
          <Link href="/admin/properties" className="text-sm text-accent">
            {t.properties}
          </Link>
        </div>
        <ul className="divide-y divide-border rounded border border-border">
          {properties
            .filter((p) => !p.deletedAt)
            .slice(0, 5)
            .map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 bg-bg-elevated px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.title || "ללא כותרת"}</p>
                  <p className="text-xs text-text-muted">{statusLabelHe(p.status)}</p>
                </div>
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="text-sm text-accent"
                >
                  {t.edit}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
