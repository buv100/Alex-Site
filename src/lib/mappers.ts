import type { Property } from "@/lib/types";
import type { PropertyDocument } from "@/lib/models/Property";
import type { Lead } from "@/lib/types";
import type { LeadDocument } from "@/lib/models/Lead";

function iso(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  return new Date(d).toISOString();
}

export function mapProperty(doc: PropertyDocument): Property {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description ?? "",
    dealType: doc.dealType,
    propertyType: doc.propertyType,
    status: doc.status,
    price: doc.price ?? null,
    currency: "ILS",
    rooms: doc.rooms,
    sizeSqm: doc.sizeSqm ?? null,
    floor: doc.floor ?? null,
    totalFloors: doc.totalFloors ?? null,
    hasElevator: Boolean(doc.hasElevator),
    hasParking: Boolean(doc.hasParking),
    hasBalcony: Boolean(doc.hasBalcony),
    direction: doc.direction ?? null,
    city: doc.city || "ירושלים",
    neighborhood: doc.neighborhood || "",
    street: doc.street ?? null,
    arnona: doc.arnona ?? null,
    vaadBayit: doc.vaadBayit ?? null,
    areaPopulationNotes: doc.areaPopulationNotes ?? null,
    isOpportunity: Boolean(doc.isOpportunity),
    isExclusive: Boolean(doc.isExclusive),
    images: (doc.images ?? []).map((img, i) => ({
      url: img.url,
      alt: img.alt,
      order: img.order ?? i,
    })),
    publishedAt: iso(doc.publishedAt),
    archivedAt: iso(doc.archivedAt),
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date().toISOString(),
    deletedAt: iso(doc.deletedAt),
    ownerName: doc.ownerName ?? null,
    ownerPhone: doc.ownerPhone ?? null,
    ownerNotes: doc.ownerNotes ?? null,
    minPriceNegotiable: doc.minPriceNegotiable ?? null,
    internalNotes: doc.internalNotes ?? null,
    exactAddress: doc.exactAddress ?? null,
  };
}

export function mapLead(doc: LeadDocument): Lead {
  return {
    id: String(doc._id),
    type: doc.type,
    name: doc.name,
    phone: doc.phone,
    message: doc.message ?? null,
    propertyId: doc.propertyId ? String(doc.propertyId) : null,
    propertyTitle: doc.propertyTitle ?? null,
    propertyUrl: doc.propertyUrl ?? null,
    status: doc.status,
    privacyConsentAt: iso(doc.privacyConsentAt) ?? new Date().toISOString(),
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date().toISOString(),
  };
}
