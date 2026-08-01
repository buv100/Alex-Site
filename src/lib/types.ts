export type DealType = "sale" | "rent";

export type PropertyType =
  | "apartment"
  | "penthouse"
  | "duplex"
  | "garden"
  | "studio"
  | "other";

export type PropertyStatus =
  | "draft"
  | "published"
  | "sold"
  | "rented";

export type LeadType = "property" | "general" | "seller";
export type LeadStatus = "new" | "in_progress" | "closed";

export interface PropertyImage {
  url: string;
  alt: string;
  order: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  dealType: DealType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number | null;
  currency: "ILS";
  rooms: number;
  sizeSqm: number | null;
  floor: number | null;
  totalFloors: number | null;
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  direction: string | null;
  city: string;
  neighborhood: string;
  street: string | null;
  arnona: number | null;
  vaadBayit: number | null;
  areaPopulationNotes: string | null;
  isOpportunity: boolean;
  isExclusive: boolean;
  images: PropertyImage[];
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Private — admin only
  ownerName: string | null;
  ownerPhone: string | null;
  ownerNotes: string | null;
  minPriceNegotiable: number | null;
  internalNotes: string | null;
  exactAddress: string | null;
}

/** Public-safe property (no private fields) */
export type PublicProperty = Omit<
  Property,
  | "ownerName"
  | "ownerPhone"
  | "ownerNotes"
  | "minPriceNegotiable"
  | "internalNotes"
  | "exactAddress"
>;

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  message: string | null;
  propertyId: string | null;
  propertyTitle: string | null;
  propertyUrl: string | null;
  status: LeadStatus;
  privacyConsentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  favorites: string[];
  privacyConsentAt: string;
  createdAt: string;
}

export interface PropertyFilters {
  dealType?: DealType | "";
  neighborhood?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  minRooms?: number | "";
  opportunity?: boolean;
  exclusive?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasBalcony?: boolean;
}
