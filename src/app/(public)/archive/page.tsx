"use client";

import { useMemo } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyCard } from "@/components/property/PropertyCard";

export default function ArchivePage() {
  const { ready, getArchiveListings } = useDemo();
  const items = useMemo(() => {
    if (!ready) return [];
    return getArchiveListings();
  }, [ready, getArchiveListings]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-accent">הנכסים שמכרנו</h1>
      <p className="mt-2 text-text-muted">
        ארכיון עסקאות שהושלמו — לשקיפות ולהיכרות עם סגנון העבודה.
      </p>
      {!ready ? (
        <p className="mt-10 text-text-muted">טוען…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-text-muted">עדיין אין נכסים בארכיון.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
