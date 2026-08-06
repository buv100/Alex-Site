import type { DealType, Property, PropertyType } from "./types";

export function formatPrice(price: number | null, currency = "ILS"): string {
  if (price === null || price === undefined) {
    return "צור קשר לבירור";
  }
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Display helpers for money fields while typing: 1200000 → 1,200,000 */
export function formatPriceInput(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function parsePriceInput(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export function dealTypeLabel(dealType: DealType): string {
  return dealType === "sale" ? "למכירה" : "להשכרה";
}

export function propertyTypeLabel(type: PropertyType): string {
  const map: Record<PropertyType, string> = {
    apartment: "דירה",
    penthouse: "פנטהאוז",
    duplex: "דופלקס",
    garden: "דירת גן",
    studio: "סטודיו",
    other: "אחר",
  };
  return map[type];
}

export function publicAddress(p: Pick<Property, "city" | "neighborhood" | "street">): string {
  const parts = [p.city, p.neighborhood, p.street].filter(Boolean);
  return parts.join(", ");
}

export function statusLabelHe(status: Property["status"]): string {
  const map = {
    draft: "טיוטה",
    published: "מפורסם",
    sold: "נמכר",
    rented: "הושכר",
  } as const;
  return map[status];
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
