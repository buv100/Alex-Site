import type { Property, PublicProperty } from "./types";

const PRIVATE_KEYS = [
  "ownerName",
  "ownerPhone",
  "ownerNotes",
  "minPriceNegotiable",
  "internalNotes",
  "exactAddress",
] as const;

export function toPublicProperty(p: Property): PublicProperty {
  const copy = { ...p };
  for (const key of PRIVATE_KEYS) {
    delete (copy as Record<string, unknown>)[key];
  }
  return copy as PublicProperty;
}

export function isListedPublicly(p: Property): boolean {
  return p.status === "published" && !p.deletedAt && p.images.length >= 1;
}

export function isArchivedPublicly(p: Property): boolean {
  return (
    (p.status === "sold" || p.status === "rented") &&
    !p.deletedAt &&
    p.images.length >= 1
  );
}
