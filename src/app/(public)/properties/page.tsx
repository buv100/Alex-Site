"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  applyFilters,
  PropertyFiltersBar,
} from "@/components/property/PropertyFiltersBar";
import type { PropertyFilters } from "@/lib/types";

export default function PropertiesPage() {
  const { ready, getPublicListings } = useDemo();
  const [filters, setFilters] = useState<PropertyFilters>({});

  const items = useMemo(() => {
    if (!ready) return [];
    return applyFilters(getPublicListings(), filters);
  }, [ready, getPublicListings, filters]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-accent">נכסים בירושלים</h1>
      <p className="mt-2 text-text-muted">
        סינון לפי שכונה, מחיר וסוג עסקה — בלי חיפוש מאגר ענק.
      </p>

      <div className="mt-8">
        <PropertyFiltersBar value={filters} onChange={setFilters} />
      </div>

      {!ready ? (
        <p className="mt-10 text-text-muted">טוען…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-text-muted">לא נמצאו נכסים לפי הסינון.</p>
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
