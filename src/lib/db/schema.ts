import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { PropertyImage } from "@/lib/types";

export const properties = pgTable("properties", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  dealType: text("deal_type").notNull(),
  propertyType: text("property_type").notNull(),
  status: text("status").notNull().default("draft"),
  price: doublePrecision("price"),
  currency: text("currency").notNull().default("ILS"),
  rooms: doublePrecision("rooms").notNull(),
  sizeSqm: doublePrecision("size_sqm"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  hasElevator: boolean("has_elevator").notNull().default(false),
  hasParking: boolean("has_parking").notNull().default(false),
  hasBalcony: boolean("has_balcony").notNull().default(false),
  direction: text("direction"),
  city: text("city").notNull().default("ירושלים"),
  neighborhood: text("neighborhood").notNull().default(""),
  street: text("street"),
  arnona: doublePrecision("arnona"),
  vaadBayit: doublePrecision("vaad_bayit"),
  areaPopulationNotes: text("area_population_notes"),
  isOpportunity: boolean("is_opportunity").notNull().default(false),
  isExclusive: boolean("is_exclusive").notNull().default(false),
  images: jsonb("images").$type<PropertyImage[]>().notNull().default([]),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ownerName: text("owner_name"),
  ownerPhone: text("owner_phone"),
  ownerNotes: text("owner_notes"),
  minPriceNegotiable: doublePrecision("min_price_negotiable"),
  internalNotes: text("internal_notes"),
  exactAddress: text("exact_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  propertyId: text("property_id"),
  propertyTitle: text("property_title"),
  propertyUrl: text("property_url"),
  status: text("status").notNull().default("new"),
  privacyConsentAt: timestamp("privacy_consent_at", {
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  favorites: text("favorites").array().notNull().default([]),
  privacyConsentAt: timestamp("privacy_consent_at", {
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PropertyRow = typeof properties.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
export type UserRow = typeof users.$inferSelect;
