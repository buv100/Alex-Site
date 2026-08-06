"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { getAdminDict } from "@/lib/i18n/admin";
import { fileToCompressedDataUrl } from "@/lib/client-image";
import { formatPriceInput, parsePriceInput } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { Property, PropertyType, DealType } from "@/lib/types";

export function PropertyForm({ initial }: { initial: Property }) {
  const {
    saveProperty,
    softDeleteProperty,
    restoreProperty,
    adminLocale,
  } = useDemo();
  const t = getAdminDict(adminLocale);
  const router = useRouter();
  const [form, setForm] = useState<Property>(initial);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  function setField<K extends keyof Property>(key: K, value: Property[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function errorMessage(code: string) {
    if (code === "cannot_publish_no_image") return t.cannotPublishNoImage;
    if (code === "unauthorized") return t.sessionExpired;
    if (code === "image_too_large") return t.imageTooLarge;
    return t.saveFailed;
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    setForm((f) => ({
      ...f,
      images: [
        ...f.images,
        {
          url: imageUrl.trim(),
          alt: imageAlt.trim() || f.title || "תמונת נכס",
          order: f.images.length,
        },
      ],
    }));
    setImageUrl("");
    setImageAlt("");
  }

  function removeImage(index: number) {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        order: i,
      })),
    }));
  }

  function moveImage(index: number, dir: -1 | 1) {
    setForm((f) => {
      const next = [...f.images];
      const j = index + dir;
      if (j < 0 || j >= next.length) return f;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...f, images: next.map((img, i) => ({ ...img, order: i })) };
    });
  }

  async function onSave() {
    setBusy(true);
    const next =
      form.status === "published" && form.images.length < 1
        ? { ...form, status: "draft" as const }
        : form;
    const res = await saveProperty(next);
    setBusy(false);
    if (!res.ok) {
      setMsg(errorMessage(res.error));
      return;
    }
    setForm(res.property);
    setMsg(t.saved);
  }

  async function onPublish() {
    if (form.images.length < 1) {
      setMsg(t.cannotPublishNoImage);
      return;
    }
    setBusy(true);
    const next = {
      ...form,
      status: "published" as const,
      publishedAt: form.publishedAt ?? new Date().toISOString(),
    };
    const res = await saveProperty(next);
    setBusy(false);
    if (!res.ok) {
      setMsg(errorMessage(res.error));
      return;
    }
    setForm(res.property);
    setMsg(t.publishedOk);
  }

  return (
    <div className="space-y-6 pb-28 sm:pb-24">
      <section className="space-y-4">
        <h2 className="font-display text-xl text-accent">{t.publicSection}</h2>

        <div className="field">
          <label htmlFor="title">כותרת</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="description">תיאור</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label htmlFor="dealType">סוג עסקה</label>
            <select
              id="dealType"
              value={form.dealType}
              onChange={(e) => setField("dealType", e.target.value as DealType)}
            >
              <option value="sale">מכירה</option>
              <option value="rent">שכירות</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="propertyType">סוג דירה</label>
            <select
              id="propertyType"
              value={form.propertyType}
              onChange={(e) =>
                setField("propertyType", e.target.value as PropertyType)
              }
            >
              <option value="apartment">דירה</option>
              <option value="penthouse">פנטהאוז</option>
              <option value="duplex">דופלקס</option>
              <option value="garden">דירת גן</option>
              <option value="studio">סטודיו</option>
              <option value="other">אחר</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="price">מחיר (ריק = צור קשר לבירור)</label>
          <input
            id="price"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={formatPriceInput(form.price)}
            onChange={(e) => setField("price", parsePriceInput(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label htmlFor="rooms">חדרים</label>
            <input
              id="rooms"
              type="number"
              step="0.5"
              value={form.rooms}
              onChange={(e) => setField("rooms", Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="size">שטח מ״ר</label>
            <input
              id="size"
              type="number"
              value={form.sizeSqm ?? ""}
              onChange={(e) =>
                setField(
                  "sizeSqm",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label htmlFor="floor">קומה</label>
            <input
              id="floor"
              type="number"
              value={form.floor ?? ""}
              onChange={(e) =>
                setField(
                  "floor",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>
          <div className="field">
            <label htmlFor="totalFloors">סה״כ קומות</label>
            <input
              id="totalFloors"
              type="number"
              value={form.totalFloors ?? ""}
              onChange={(e) =>
                setField(
                  "totalFloors",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="neighborhood">שכונה</label>
          <select
            id="neighborhood"
            value={form.neighborhood}
            onChange={(e) => setField("neighborhood", e.target.value)}
          >
            <option value="">בחרו שכונה</option>
            {siteConfig.neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="street">שם רחוב בלבד (בלי מספר)</label>
          <input
            id="street"
            value={form.street ?? ""}
            onChange={(e) => setField("street", e.target.value || null)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label htmlFor="arnona">ארנונה</label>
            <input
              id="arnona"
              type="number"
              value={form.arnona ?? ""}
              onChange={(e) =>
                setField(
                  "arnona",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>
          <div className="field">
            <label htmlFor="vaad">ועד בית</label>
            <input
              id="vaad"
              type="number"
              value={form.vaadBayit ?? ""}
              onChange={(e) =>
                setField(
                  "vaadBayit",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="population">אוכלוסייה / אופי האזור</label>
          <textarea
            id="population"
            value={form.areaPopulationNotes ?? ""}
            onChange={(e) =>
              setField("areaPopulationNotes", e.target.value || null)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="direction">כיווני אוויר</label>
          <input
            id="direction"
            value={form.direction ?? ""}
            onChange={(e) => setField("direction", e.target.value || null)}
          />
        </div>

        <fieldset className="flex flex-wrap gap-4">
          <legend className="mb-2 text-sm text-text-muted">תכונות ותגיות</legend>
          {(
            [
              ["hasElevator", "מעלית"],
              ["hasParking", "חניה"],
              ["hasBalcony", "מרפסת"],
              ["isOpportunity", "בהזדמנות"],
              ["isExclusive", "בלעדיות"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => setField(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </fieldset>
      </section>

      <section className="space-y-3 rounded border border-border bg-bg-elevated p-4">
        <h2 className="font-display text-xl text-accent">{t.images}</h2>
        <p className="text-xs text-text-muted">{t.uploadHint}</p>
        <div className="field">
          <label htmlFor="img-file">העלאה מגלריית התמונות</label>
          <input
            id="img-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setMsg(t.uploading);
              try {
                const body = new FormData();
                body.append("file", file);
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body,
                });
                let url: string | null = null;
                if (res.ok) {
                  const data = (await res.json()) as { url: string };
                  url = data.url;
                } else {
                  // No Cloudinary (or upload error): compress locally and embed.
                  try {
                    url = await fileToCompressedDataUrl(file);
                  } catch (err) {
                    const code =
                      err instanceof Error ? err.message : "upload_failed";
                    setMsg(errorMessage(code));
                    setBusy(false);
                    e.target.value = "";
                    return;
                  }
                }
                setForm((f) => ({
                  ...f,
                  images: [
                    ...f.images,
                    {
                      url: url!,
                      alt: imageAlt.trim() || f.title || "תמונת נכס",
                      order: f.images.length,
                    },
                  ],
                }));
                setMsg(t.saved);
              } catch {
                setMsg(t.uploadFailed);
              }
              setBusy(false);
              e.target.value = "";
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="img-url">{t.addImageUrl}</label>
          <input
            id="img-url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="field">
          <label htmlFor="img-alt">תיאור לתמונה (alt)</label>
          <input
            id="img-alt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-ghost w-full" onClick={addImage}>
          הוסף תמונה
        </button>
        <ul className="space-y-2">
          {form.images.map((img, i) => (
            <li
              key={img.url + i}
              className="flex items-center gap-2 rounded border border-border p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="h-14 w-20 object-cover" />
              <div className="min-w-0 flex-1 text-xs text-text-muted truncate">
                {img.alt}
              </div>
              <button type="button" className="text-xs" onClick={() => moveImage(i, -1)}>
                ↑
              </button>
              <button type="button" className="text-xs" onClick={() => moveImage(i, 1)}>
                ↓
              </button>
              <button
                type="button"
                className="text-xs text-danger"
                onClick={() => removeImage(i)}
              >
                מחק
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded border border-danger/40 bg-danger/5 p-4">
        <h2 className="font-display text-xl text-danger">{t.privateSection}</h2>
        <div className="field">
          <label htmlFor="ownerName">שם בעלים</label>
          <input
            id="ownerName"
            value={form.ownerName ?? ""}
            onChange={(e) => setField("ownerName", e.target.value || null)}
          />
        </div>
        <div className="field">
          <label htmlFor="ownerPhone">טלפון בעלים</label>
          <input
            id="ownerPhone"
            type="tel"
            value={form.ownerPhone ?? ""}
            onChange={(e) => setField("ownerPhone", e.target.value || null)}
          />
        </div>
        <div className="field">
          <label htmlFor="exactAddress">כתובת מדויקת (פנימי)</label>
          <input
            id="exactAddress"
            value={form.exactAddress ?? ""}
            onChange={(e) => setField("exactAddress", e.target.value || null)}
          />
        </div>
        <div className="field">
          <label htmlFor="minPrice">מחיר מינימום למו״מ</label>
          <input
            id="minPrice"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={formatPriceInput(form.minPriceNegotiable)}
            onChange={(e) =>
              setField("minPriceNegotiable", parsePriceInput(e.target.value))
            }
          />
        </div>
        <div className="field">
          <label htmlFor="internalNotes">הערות פנימיות</label>
          <textarea
            id="internalNotes"
            value={form.internalNotes ?? ""}
            onChange={(e) => setField("internalNotes", e.target.value || null)}
          />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-elevated/95 px-3 pt-2 backdrop-blur pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {msg && (
          <p
            className="mx-auto mb-2 max-w-3xl text-center text-sm text-accent"
            role="status"
          >
            {msg}
          </p>
        )}
        <div className="mx-auto flex max-w-3xl gap-2">
          <button
            type="button"
            className="btn btn-primary min-h-11 flex-1 py-2 text-sm"
            onClick={onSave}
            disabled={busy}
          >
            {t.save}
          </button>
          <button
            type="button"
            className="btn btn-ghost min-h-11 flex-1 py-2 text-sm"
            onClick={onPublish}
            disabled={busy}
          >
            {t.publish}
          </button>
          <button
            type="button"
            className="btn btn-ghost min-h-11 shrink-0 px-3 py-2 text-sm"
            disabled={busy}
            onClick={async () => {
              const res = await saveProperty(form);
              if (!res.ok) {
                setMsg(errorMessage(res.error));
                return;
              }
              setForm(res.property);
              router.push(`/admin/properties/${res.property.id}/preview`);
            }}
          >
            {t.preview}
          </button>
        </div>
        <details className="mx-auto mt-1 max-w-3xl">
          <summary className="cursor-pointer list-none py-1.5 text-center text-xs text-text-muted [&::-webkit-details-marker]:hidden">
            {adminLocale === "ru" ? "Ещё действия ▾" : "עוד פעולות ▾"}
          </summary>
          <div className="flex flex-wrap justify-center gap-2 pb-1">
            <button
              type="button"
              className="btn btn-ghost min-h-10 px-3 py-1.5 text-xs"
              onClick={async () => {
                const res = await saveProperty({ ...form, status: "sold" });
                if (!res.ok) {
                  setMsg(errorMessage(res.error));
                  return;
                }
                setForm(res.property);
              }}
            >
              {t.markSold}
            </button>
            <button
              type="button"
              className="btn btn-ghost min-h-10 px-3 py-1.5 text-xs"
              onClick={async () => {
                const res = await saveProperty({ ...form, status: "rented" });
                if (!res.ok) {
                  setMsg(errorMessage(res.error));
                  return;
                }
                setForm(res.property);
              }}
            >
              {t.markRented}
            </button>
            {form.deletedAt ? (
              <button
                type="button"
                className="btn btn-ghost min-h-10 px-3 py-1.5 text-xs"
                onClick={() => {
                  restoreProperty(form.id);
                  setForm((f) => ({ ...f, deletedAt: null }));
                }}
              >
                {t.restore}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-danger min-h-10 px-3 py-1.5 text-xs"
                onClick={() => {
                  softDeleteProperty(form.id);
                  setForm((f) => ({
                    ...f,
                    deletedAt: new Date().toISOString(),
                  }));
                }}
              >
                {t.delete}
              </button>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
