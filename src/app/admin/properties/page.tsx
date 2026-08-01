"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { formatPrice, statusLabelHe } from "@/lib/format";
import type { PropertyStatus } from "@/lib/types";

export default function AdminPropertiesPage() {
  const { properties, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const [status, setStatus] = useState<PropertyStatus | "all" | "deleted">("all");

  const list = properties.filter((p) => {
    if (status === "deleted") return Boolean(p.deletedAt);
    if (p.deletedAt) return false;
    if (status === "all") return true;
    return p.status === status;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-3xl text-accent">{t.properties}</h1>
        <Link href="/admin/properties/new" className="btn btn-primary min-h-11 px-3 text-sm">
          {t.newProperty}
        </Link>
      </div>

      <div className="field">
        <label htmlFor="filter-status">{t.status}</label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">הכל</option>
          <option value="draft">טיוטה</option>
          <option value="published">מפורסם</option>
          <option value="sold">נמכר</option>
          <option value="rented">הושכר</option>
          <option value="deleted">נמחק</option>
        </select>
      </div>

      {list.length === 0 ? (
        <p className="text-text-muted">{t.noItems}</p>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li
              key={p.id}
              className="rounded border border-border bg-bg-elevated p-4"
            >
              <p className="font-medium">{p.title || "ללא כותרת"}</p>
              <p className="mt-1 text-sm text-text-muted">
                {statusLabelHe(p.status)} · {formatPrice(p.price)} ·{" "}
                {p.neighborhood || "—"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="btn btn-ghost min-h-11 px-3 text-sm"
                >
                  {t.edit}
                </Link>
                <Link
                  href={`/admin/properties/${p.id}/preview`}
                  className="btn btn-ghost min-h-11 px-3 text-sm"
                >
                  {t.preview}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
