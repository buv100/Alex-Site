"use client";

import Link from "next/link";
import Image from "next/image";
import type { PublicProperty } from "@/lib/types";
import {
  dealTypeLabel,
  formatPrice,
  propertyTypeLabel,
  publicAddress,
} from "@/lib/format";

export function PropertyCard({ property }: { property: PublicProperty }) {
  const cover = property.images[0];

  return (
    <article className="group overflow-hidden border border-border bg-bg-elevated transition hover:border-accent/50">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted">
              אין תמונה
            </div>
          )}
          {/* Scrim so labels stay readable on any photo */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent"
            aria-hidden
          />
          <div className="absolute start-3 top-3 z-10 flex flex-wrap gap-2">
            <span className="tag-on-media tag-on-media--deal">
              {dealTypeLabel(property.dealType)}
            </span>
            {property.isOpportunity && (
              <span className="tag-on-media tag-on-media--hot">בהזדמנות</span>
            )}
            {property.isExclusive && (
              <span className="tag-on-media">בלעדיות</span>
            )}
          </div>
        </div>
        <div className="space-y-2 p-4">
          <h2 className="font-display text-xl leading-snug text-text group-hover:text-accent">
            {property.title}
          </h2>
          <p className="text-sm text-text-muted">{publicAddress(property)}</p>
          <p className="text-lg font-semibold text-accent">
            {formatPrice(property.price)}
            {property.dealType === "rent" && property.price !== null && (
              <span className="text-sm font-normal text-text-muted"> / חודש</span>
            )}
          </p>
          <p className="text-sm text-text-muted">
            {property.rooms} חדרים · {propertyTypeLabel(property.propertyType)}
            {property.sizeSqm ? ` · ${property.sizeSqm} מ״ר` : ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
