import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";
import {
  brokerMarketingLine,
  PRIVATE_PROPERTY_FIELDS,
} from "@/lib/legal-display";
import { toPublicProperty } from "@/lib/property-public";
import type { Property } from "@/lib/types";

describe("formatPrice", () => {
  it("shows contact text when price is null", () => {
    expect(formatPrice(null)).toContain("צור קשר");
  });

  it("formats ILS amounts", () => {
    expect(formatPrice(1500000)).toMatch(/1/);
  });
});

describe("broker disclosure", () => {
  it("includes name, broker role and license", () => {
    const line = brokerMarketingLine();
    expect(line).toContain("אלכס גריביאן");
    expect(line).toContain("מתווך במקרקעין");
    expect(line).toContain("26523");
  });
});

describe("toPublicProperty", () => {
  it("strips private fields", () => {
    const sample = {
      id: "p1",
      title: "דירה",
      description: "x",
      dealType: "sale",
      propertyType: "apartment",
      status: "published",
      price: 100,
      currency: "ILS",
      rooms: 3,
      sizeSqm: 80,
      floor: 2,
      totalFloors: 4,
      hasElevator: true,
      hasParking: false,
      hasBalcony: true,
      direction: null,
      city: "ירושלים",
      neighborhood: "רחביה",
      street: "הארז",
      arnona: null,
      vaadBayit: null,
      areaPopulationNotes: null,
      isOpportunity: false,
      isExclusive: false,
      images: [{ url: "/x.jpg", alt: "דירה", order: 0 }],
      publishedAt: null,
      archivedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      ownerName: "SECRET",
      ownerPhone: "050",
      ownerNotes: "note",
      minPriceNegotiable: 1,
      internalNotes: "internal",
      exactAddress: "secret st 1",
    } as Property;

    const pub = toPublicProperty(sample);
    for (const key of PRIVATE_PROPERTY_FIELDS) {
      expect(pub).not.toHaveProperty(key);
    }
    expect(pub.title).toBe("דירה");
  });
});
