"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import {
  dealTypeLabel,
  formatPrice,
  propertyTypeLabel,
  publicAddress,
  statusLabelHe,
} from "@/lib/format";

export default function PreviewClient() {
  const params = useParams<{ id: string }>();
  const { getPropertyById, setPropertyStatus, ready, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const p = ready ? getPropertyById(params.id) : undefined;

  if (!ready) return <p>…</p>;
  if (!p) {
    return <p>לא נמצא</p>;
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl text-accent">{t.preview}</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/properties/${p.id}/edit`}
            className="btn btn-ghost min-h-11 px-3 text-sm"
          >
            {t.edit}
          </Link>
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
        </div>
      </div>

      <p className="text-sm text-text-muted">
        סטטוס נוכחי: {statusLabelHe(p.status)} · תמונות: {p.images.length}
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
          {p.rooms} חדרים · {propertyTypeLabel(p.propertyType)}
        </p>
        <p className="whitespace-pre-line text-text-muted">{p.description}</p>
      </div>

      <div className="rounded border border-danger/40 bg-danger/5 p-4 text-sm">
        <p className="font-semibold text-danger">{t.privateSection}</p>
        <p>בעלים: {p.ownerName || "—"}</p>
        <p>טלפון: {p.ownerPhone || "—"}</p>
        <p>כתובת מדויקת: {p.exactAddress || "—"}</p>
        <p>מינ׳ מו״מ: {p.minPriceNegotiable ?? "—"}</p>
        <p>הערות: {p.internalNotes || "—"}</p>
      </div>

      {p.status === "published" && (
        <Link href={`/properties/${p.id}`} className="btn btn-ghost w-full">
          {t.viewSite}
        </Link>
      )}
    </div>
  );
}
