import type { Property, Lead, DealType, PropertyType, PropertyStatus, LeadType, LeadStatus } from "@/lib/types";
import type { PropertyRow, LeadRow } from "@/lib/db/schema";
import type { PropertyImage } from "@/lib/types";

function iso(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  return new Date(d).toISOString();
}

function asImages(raw: PropertyImage[] | null | undefined): PropertyImage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((img, i) => ({
    url: img.url,
    alt: img.alt ?? "",
    order: img.order ?? i,
  }));
}

export function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    dealType: row.dealType as DealType,
    propertyType: row.propertyType as PropertyType,
    status: row.status as PropertyStatus,
    price: row.price ?? null,
    currency: "ILS",
    rooms: row.rooms,
    sizeSqm: row.sizeSqm ?? null,
    floor: row.floor ?? null,
    totalFloors: row.totalFloors ?? null,
    hasElevator: Boolean(row.hasElevator),
    hasParking: Boolean(row.hasParking),
    hasBalcony: Boolean(row.hasBalcony),
    direction: row.direction ?? null,
    city: row.city || "ירושלים",
    neighborhood: row.neighborhood || "",
    street: row.street ?? null,
    arnona: row.arnona ?? null,
    vaadBayit: row.vaadBayit ?? null,
    areaPopulationNotes: row.areaPopulationNotes ?? null,
    isOpportunity: Boolean(row.isOpportunity),
    isExclusive: Boolean(row.isExclusive),
    images: asImages(row.images),
    publishedAt: iso(row.publishedAt),
    archivedAt: iso(row.archivedAt),
    createdAt: iso(row.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(row.updatedAt) ?? new Date().toISOString(),
    deletedAt: iso(row.deletedAt),
    ownerName: row.ownerName ?? null,
    ownerPhone: row.ownerPhone ?? null,
    ownerNotes: row.ownerNotes ?? null,
    minPriceNegotiable: row.minPriceNegotiable ?? null,
    internalNotes: row.internalNotes ?? null,
    exactAddress: row.exactAddress ?? null,
  };
}

export function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    type: row.type as LeadType,
    name: row.name,
    phone: row.phone,
    message: row.message ?? null,
    propertyId: row.propertyId ?? null,
    propertyTitle: row.propertyTitle ?? null,
    propertyUrl: row.propertyUrl ?? null,
    status: row.status as LeadStatus,
    privacyConsentAt: iso(row.privacyConsentAt) ?? new Date().toISOString(),
    createdAt: iso(row.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(row.updatedAt) ?? new Date().toISOString(),
  };
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function dateOrNull(v: unknown): Date | null {
  if (!v) return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Build insert/update values from admin JSON body (camelCase). */
export function propertyValuesFromBody(body: Record<string, unknown>) {
  const imagesRaw = Array.isArray(body.images) ? body.images : [];
  const images: PropertyImage[] = imagesRaw.map((img, i) => {
    const item = img as Record<string, unknown>;
    return {
      url: String(item.url ?? ""),
      alt: String(item.alt ?? ""),
      order: typeof item.order === "number" ? item.order : i,
    };
  });

  return {
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    dealType: String(body.dealType ?? "sale"),
    propertyType: String(body.propertyType ?? "apartment"),
    status: String(body.status ?? "draft"),
    price: numOrNull(body.price),
    currency: "ILS",
    rooms: Number(body.rooms ?? 0),
    sizeSqm: numOrNull(body.sizeSqm),
    floor: numOrNull(body.floor) !== null ? Math.trunc(Number(body.floor)) : null,
    totalFloors:
      numOrNull(body.totalFloors) !== null
        ? Math.trunc(Number(body.totalFloors))
        : null,
    hasElevator: bool(body.hasElevator),
    hasParking: bool(body.hasParking),
    hasBalcony: bool(body.hasBalcony),
    direction: body.direction != null ? String(body.direction) : null,
    city: String(body.city || "ירושלים"),
    neighborhood: String(body.neighborhood ?? ""),
    street: body.street != null && body.street !== "" ? String(body.street) : null,
    arnona: numOrNull(body.arnona),
    vaadBayit: numOrNull(body.vaadBayit),
    areaPopulationNotes:
      body.areaPopulationNotes != null
        ? String(body.areaPopulationNotes)
        : null,
    isOpportunity: bool(body.isOpportunity),
    isExclusive: bool(body.isExclusive),
    images,
    publishedAt: dateOrNull(body.publishedAt),
    archivedAt: dateOrNull(body.archivedAt),
    deletedAt: dateOrNull(body.deletedAt),
    ownerName: body.ownerName != null ? String(body.ownerName) : null,
    ownerPhone: body.ownerPhone != null ? String(body.ownerPhone) : null,
    ownerNotes: body.ownerNotes != null ? String(body.ownerNotes) : null,
    minPriceNegotiable: numOrNull(body.minPriceNegotiable),
    internalNotes:
      body.internalNotes != null ? String(body.internalNotes) : null,
    exactAddress: body.exactAddress != null ? String(body.exactAddress) : null,
  };
}

/** UUID v1–v8 (persisted server ids). Draft client ids look like `p…`. */
export function isPersistedId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
}
