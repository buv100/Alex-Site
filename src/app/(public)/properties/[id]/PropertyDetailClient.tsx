"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  dealTypeLabel,
  formatPrice,
  propertyTypeLabel,
  publicAddress,
} from "@/lib/format";
import {
  buildWhatsAppUrl,
  propertyInquiryMessage,
  sharePropertyMessage,
} from "@/lib/whatsapp";

export default function PropertyDetailClient() {
  const params = useParams<{ id: string }>();
  const { ready, getPublicPropertyById, currentUser, toggleFavorite } = useDemo();
  const [activeImg, setActiveImg] = useState(0);

  const property = useMemo(() => {
    if (!ready) return undefined;
    return getPublicPropertyById(params.id);
  }, [ready, getPublicPropertyById, params.id]);

  if (!ready) {
    return <p className="p-8 text-text-muted">טוען…</p>;
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">הנכס לא נמצא</h1>
        <Link href="/properties" className="btn btn-ghost mt-6">
          חזרה לנכסים
        </Link>
      </div>
    );
  }

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://alex-nekasim.demo/properties/${property.id}`;

  const wa = buildWhatsAppUrl(
    propertyInquiryMessage({
      title: property.title,
      neighborhood: property.neighborhood,
      url,
    }),
  );
  const share = buildWhatsAppUrl(
    sharePropertyMessage({ title: property.title, url }),
  );

  const isFav = currentUser?.favorites.includes(property.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden border border-border bg-surface">
            {property.images[activeImg] && (
              <Image
                src={property.images[activeImg].url}
                alt={property.images[activeImg].alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          {property.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {property.images.map((img, i) => (
                <button
                  key={img.url + i}
                  type="button"
                  className={`relative h-16 w-24 shrink-0 overflow-hidden border ${
                    i === activeImg ? "border-accent" : "border-border"
                  }`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`תמונה ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={`תמונה ${i + 1} מתוך ${property.images.length} — ${property.title}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="tag">{dealTypeLabel(property.dealType)}</span>
            {property.isOpportunity && <span className="tag">בהזדמנות</span>}
            {property.isExclusive && <span className="tag">בלעדיות</span>}
            {(property.status === "sold" || property.status === "rented") && (
              <span className="tag">
                {property.status === "sold" ? "נמכר" : "הושכר"}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl leading-tight">{property.title}</h1>
          <p className="text-text-muted">{publicAddress(property)}</p>
          <p className="text-2xl font-semibold text-accent">
            {formatPrice(property.price)}
            {property.dealType === "rent" && property.price !== null && (
              <span className="text-base font-normal text-text-muted"> / חודש</span>
            )}
          </p>

          <dl className="grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
            <div>
              <dt className="text-text-muted">חדרים</dt>
              <dd>{property.rooms}</dd>
            </div>
            <div>
              <dt className="text-text-muted">סוג</dt>
              <dd>{propertyTypeLabel(property.propertyType)}</dd>
            </div>
            {property.sizeSqm != null && (
              <div>
                <dt className="text-text-muted">שטח</dt>
                <dd>{property.sizeSqm} מ״ר</dd>
              </div>
            )}
            {property.floor != null && (
              <div>
                <dt className="text-text-muted">קומה</dt>
                <dd>
                  {property.floor}
                  {property.totalFloors != null ? ` / ${property.totalFloors}` : ""}
                </dd>
              </div>
            )}
            {property.arnona != null && (
              <div>
                <dt className="text-text-muted">ארנונה</dt>
                <dd>₪{property.arnona}</dd>
              </div>
            )}
            {property.vaadBayit != null && (
              <div>
                <dt className="text-text-muted">ועד בית</dt>
                <dd>₪{property.vaadBayit}</dd>
              </div>
            )}
            <div>
              <dt className="text-text-muted">מעלית</dt>
              <dd>{property.hasElevator ? "כן" : "לא"}</dd>
            </div>
            <div>
              <dt className="text-text-muted">חניה</dt>
              <dd>{property.hasParking ? "כן" : "לא"}</dd>
            </div>
            <div>
              <dt className="text-text-muted">מרפסת</dt>
              <dd>{property.hasBalcony ? "כן" : "לא"}</dd>
            </div>
            {property.direction && (
              <div>
                <dt className="text-text-muted">כיוונים</dt>
                <dd>{property.direction}</dd>
              </div>
            )}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              וואטסאפ לגבי הנכס
            </a>
            <a
              href={share}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              שיתוף בוואטסאפ
            </a>
            {currentUser ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => toggleFavorite(property.id)}
              >
                {isFav ? "הסר ממועדפים" : "שמירה למועדפים"}
              </button>
            ) : (
              <Link href="/auth/register" className="btn btn-ghost">
                הרשמה למועדפים
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-accent">תיאור</h2>
          <p className="mt-4 whitespace-pre-line text-text-muted">
            {property.description}
          </p>
          {property.areaPopulationNotes && (
            <>
              <h3 className="mt-8 font-display text-xl">האוכלוסייה באזור</h3>
              <p className="mt-2 text-text-muted">{property.areaPopulationNotes}</p>
            </>
          )}
        </div>
        <div className="rounded border border-border bg-bg-elevated p-5">
          <LeadForm
            type="property"
            propertyId={property.id}
            propertyTitle={property.title}
            propertyUrl={`/properties/${property.id}`}
          />
        </div>
      </div>
    </div>
  );
}
