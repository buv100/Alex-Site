"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { formatPrice, statusLabelHe } from "@/lib/format";
import { sharePropertyMessage } from "@/lib/whatsapp";
import { PropertyPhoto } from "@/components/property/PropertyPhoto";
import type { PropertyStatus } from "@/lib/types";

export default function AdminPropertiesPage() {
  const {
    properties,
    adminLocale,
    setPropertyStatus,
    softDeleteProperty,
    restoreProperty,
  } = useDemo();
  const t = getAdminDict(adminLocale);
  const [status, setStatus] = useState<PropertyStatus | "all" | "deleted">("all");
  const [toast, setToast] = useState("");

  const list = properties.filter((p) => {
    if (status === "deleted") return Boolean(p.deletedAt);
    if (p.deletedAt) return false;
    if (status === "all") return true;
    return p.status === status;
  });

  function publicUrl(id: string) {
    if (typeof window === "undefined") return `/properties/${id}`;
    return `${window.location.origin}/properties/${id}`;
  }

  async function copyLink(id: string, title: string) {
    try {
      await navigator.clipboard.writeText(publicUrl(id));
      setToast(t.linkCopied);
      setTimeout(() => setToast(""), 2000);
    } catch {
      setToast(title);
    }
  }

  function shareWa(id: string, title: string) {
    const text = sharePropertyMessage({ title: title || "נכס", url: publicUrl(id) });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-3xl text-accent">{t.properties}</h1>
        <Link
          href="/admin/properties/new"
          className="btn btn-primary min-h-11 px-3 text-sm"
        >
          {t.newProperty}
        </Link>
      </div>

      {toast && (
        <p className="rounded border border-success/40 bg-success/10 px-3 py-2 text-sm" role="status">
          {toast}
        </p>
      )}

      <div className="field">
        <label htmlFor="filter-status">{t.status}</label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">{adminLocale === "ru" ? "Все" : "הכל"}</option>
          <option value="draft">{adminLocale === "ru" ? "Черновик" : "טיוטה"}</option>
          <option value="published">
            {adminLocale === "ru" ? "Опубликован" : "מפורסם"}
          </option>
          <option value="sold">{adminLocale === "ru" ? "Продан" : "נמכר"}</option>
          <option value="rented">{adminLocale === "ru" ? "Сдан" : "הושכר"}</option>
          <option value="deleted">{adminLocale === "ru" ? "Удалён" : "נמחק"}</option>
        </select>
      </div>

      {list.length === 0 ? (
        <p className="text-text-muted">{t.noItems}</p>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => {
            const cover = p.images[0];
            return (
              <li
                key={p.id}
                className="overflow-hidden rounded border border-border bg-bg-elevated"
              >
                <div className="flex gap-3 p-3">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded bg-surface">
                    {cover ? (
                      <PropertyPhoto
                        src={cover.url}
                        alt={cover.alt || p.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] text-text-muted">
                        —
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">
                      {p.title || (adminLocale === "ru" ? "Без названия" : "ללא כותרת")}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {statusLabelHe(p.status)} · {formatPrice(p.price)} ·{" "}
                      {p.neighborhood || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border px-3 py-3">
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
                  {!p.deletedAt && p.status !== "published" && (
                    <button
                      type="button"
                      className="btn btn-primary min-h-11 px-3 text-sm"
                      onClick={async () => {
                        const res = await setPropertyStatus(p.id, "published");
                        if (!res.ok) alert(t.cannotPublishNoImage);
                      }}
                    >
                      {t.publish}
                    </button>
                  )}
                  {!p.deletedAt && p.status === "published" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-ghost min-h-11 px-3 text-sm"
                        onClick={() => setPropertyStatus(p.id, "sold")}
                      >
                        {t.markSold}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost min-h-11 px-3 text-sm"
                        onClick={() => setPropertyStatus(p.id, "rented")}
                      >
                        {t.markRented}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost min-h-11 px-3 text-sm"
                        onClick={() => setPropertyStatus(p.id, "draft")}
                      >
                        {t.unpublish}
                      </button>
                    </>
                  )}
                  {!p.deletedAt && (
                    <>
                      <button
                        type="button"
                        className="btn btn-ghost min-h-11 px-3 text-sm"
                        onClick={() => copyLink(p.id, p.title)}
                      >
                        {t.copyLink}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost min-h-11 px-3 text-sm"
                        onClick={() => shareWa(p.id, p.title)}
                      >
                        {t.shareWa}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger min-h-11 px-3 text-sm"
                        onClick={() => {
                          if (confirm(t.confirmDelete)) softDeleteProperty(p.id);
                        }}
                      >
                        {t.delete}
                      </button>
                    </>
                  )}
                  {p.deletedAt && (
                    <button
                      type="button"
                      className="btn btn-primary min-h-11 px-3 text-sm"
                      onClick={() => restoreProperty(p.id)}
                    >
                      {t.restore}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
