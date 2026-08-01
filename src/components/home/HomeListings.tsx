"use client";

import { useMemo } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyCard } from "@/components/property/PropertyCard";
import { isListedPublicly, toPublicProperty } from "@/lib/property-public";

export function HomeListings() {
  const { properties } = useDemo();
  const items = useMemo(
    () =>
      properties
        .filter(isListedPublicly)
        .map(toPublicProperty)
        .slice(0, 3),
    [properties],
  );

  if (items.length === 0) {
    return <p className="text-text-muted">אין נכסים להצגה כרגע.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
