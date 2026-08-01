"use client";

import { useMemo } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyCard } from "@/components/property/PropertyCard";

export function HomeListings() {
  const { ready, getPublicListings } = useDemo();
  const items = useMemo(() => {
    if (!ready) return [];
    return getPublicListings().slice(0, 3);
  }, [ready, getPublicListings]);

  if (!ready) {
    return <p className="text-text-muted">טוען נכסים…</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
