"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyCard } from "@/components/property/PropertyCard";
import { toPublicProperty, isListedPublicly, isArchivedPublicly } from "@/lib/property-public";

export default function FavoritesPage() {
  const { ready, currentUser, logoutUser, properties } = useDemo();

  const favs = useMemo(() => {
    if (!currentUser) return [];
    return properties
      .filter(
        (p) =>
          currentUser.favorites.includes(p.id) &&
          (isListedPublicly(p) || isArchivedPublicly(p)),
      )
      .map(toPublicProperty);
  }, [currentUser, properties]);

  if (!ready) return <p className="p-8 text-text-muted">טוען…</p>;

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl">מועדפים</h1>
        <p className="mt-3 text-text-muted">יש להתחבר כדי לראות מועדפים.</p>
        <Link href="/auth/login" className="btn btn-primary mt-6">
          התחברות
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-accent">המועדפים שלי</h1>
          <p className="mt-1 text-sm text-text-muted">שלום, {currentUser.name}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={logoutUser}>
          התנתקות
        </button>
      </div>
      {favs.length === 0 ? (
        <p className="mt-10 text-text-muted">
          עדיין אין מועדפים.{" "}
          <Link href="/properties" className="text-accent underline">
            לעמוד הנכסים
          </Link>
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
