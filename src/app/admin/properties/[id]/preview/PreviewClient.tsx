"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import {
  dealTypeLabel,
  formatPrice,
  propertyTypeLabel,
  publicAddress,
  statusLabelHe,
} from "@/lib/format";
import { sharePropertyMessage } from "@/lib/whatsapp";

export default function PreviewClient() {
  const params = useParams<{ id: string }>();
  const {
    getPropertyById,
    setPropertyStatus,
    softDeleteProperty,
    ready,
    adminLocale,
  } = useDemo();
  const t = getAdminDict(adminLocale);
  const p = ready ? getPropertyById(params.id) : undefined;
  const [toast, setToast] = useState("");

  if (!ready) return <p>…</p>;
  if (!p) {
    return <p>{adminLocale === "ru" ? "Не найдено" : "לא נמצא"}</p>;
  }

  function publicUrl() {
    return `${window.location.origin}/properties/${p!.id}`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl());
      setToast(t.linkCopied);
      setTimeout(() => setToast(""), 2000);
    } catch {
      /* ignore */
    }
  }

  function shareWa() {
    const text = sharePropertyMessage({
      title: p!.title || "נכס",
      url: publicUrl(),
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl text-accent">{t.preview}</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/properties/${p.id}/edit`}
            className="btn btn-ghost min-h-11 px-3 text-sm"
          >
            {t.edit}
          </Link>
          {p.status !== "published" && (
            <button
              type="button"
              className="btn btn-primary min-h-11 px-3 text-sm"
              onClick={() => {
                const res = setPropertyStatus(p.id, "published");
                if (!res.ok) alert(t.cannotPublishNoImage);
              }}
            >
              {t.publish}
            </button>
          )}
        </div>
      </div>

      {toast && (
        <p className="rounded border border-success/40 bg-success/10 px-3 py-2 text-sm" role="status">
          {toast}
        </p>
      )}

      <p className="text-sm text-text-muted">
        {t.status}: {statusLabelHe(p.status)} · {t.images}: {p.images.length}
      </p>

      {p.images[0] && (
        <div className="relative aspect-[4/3] overflow-hidden border border-border">
          <Image
            src={p.images[0].url}
            alt={p.images[0].alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="tag">{dealTypeLabel(p.dealType)}</span>
          {p.isOpportunity && <span className="tag">בהזדמנות</span>}
          {p.isExclusive && <span className="tag">בלעדיות</span>}
        </div>
        <h2 className="font-display text-3xl">{p.title}</h2>
        <p className="text-text-muted">{publicAddress(p)}</p>
        <p className="text-xl text-accent">{formatPrice(p.price)}</p>
        <p className="text-sm text-text-muted">
          {p.rooms} {adminLocale === "ru" ? "комн." : "חדרים"} ·{" "}
          {propertyTypeLabel(p.propertyType)}
        </p>
        <p className="whitespace-pre-line text-text-muted">{p.description}</p>
      </div>

      <div className="rounded border border-danger/40 bg-danger/5 p-4 text-sm">
        <p className="font-semibold text-danger">{t.privateSection}</p>
        <p>
          {adminLocale === "ru" ? "Владелец" : "בעלים"}: {p.ownerName || "—"}
        </p>
        <p>
          {adminLocale === "ru" ? "Телефон" : "טלפון"}: {p.ownerPhone || "—"}
        </p>
        <p>
          {adminLocale === "ru" ? "Точный адрес" : "כתובת מדויקת"}:{" "}
          {p.exactAddress || "—"}
        </p>
        <p>
          {adminLocale === "ru" ? "Мин. торг" : "מינ׳ מו״מ"}:{" "}
          {p.minPriceNegotiable ?? "—"}
        </p>
        <p>
          {adminLocale === "ru" ? "Заметки" : "הערות"}: {p.internalNotes || "—"}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-text-muted">{t.quickActions}</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-ghost min-h-12 text-sm" onClick={copyLink}>
            {t.copyLink}
          </button>
          <button type="button" className="btn btn-ghost min-h-12 text-sm" onClick={shareWa}>
            {t.shareWa}
          </button>
          <button
            type="button"
            className="btn btn-ghost min-h-12 text-sm"
            onClick={() => setPropertyStatus(p.id, "sold")}
          >
            {t.markSold}
          </button>
          <button
            type="button"
            className="btn btn-ghost min-h-12 text-sm"
            onClick={() => setPropertyStatus(p.id, "rented")}
          >
            {t.markRented}
          </button>
          {p.status === "published" && (
            <button
              type="button"
              className="btn btn-ghost min-h-12 text-sm"
              onClick={() => setPropertyStatus(p.id, "draft")}
            >
              {t.unpublish}
            </button>
          )}
          <button
            type="button"
            className="btn btn-danger min-h-12 text-sm"
            onClick={() => {
              if (confirm(t.confirmDelete)) softDeleteProperty(p.id);
            }}
          >
            {t.delete}
          </button>
        </div>
      </div>

      {p.status === "published" && (
        <Link href={`/properties/${p.id}`} className="btn btn-ghost w-full">
          {t.viewSite}
        </Link>
      )}
    </div>
  );
}
