import { and, eq, isNull } from "drizzle-orm";
import { connectDb, hasDbConfig } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { dealTypeLabel, formatPrice, propertyTypeLabel } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { DealType, Property } from "@/lib/types";
import { isListedPublicly, toPublicProperty } from "@/lib/property-public";
import { mapProperty } from "@/lib/mappers";

export type ChatListing = {
  id: string;
  title: string;
  dealType: DealType;
  neighborhood: string;
  rooms: number;
  priceLabel: string;
  sizeSqm: number | null;
  propertyType: string;
  url: string;
  blurb: string;
};

export type ChatContext = {
  siteUrl: string;
  about: string;
  why: readonly string[];
  phone: string;
  whatsappUrl: string;
  contactPath: string;
  propertiesPath: string;
  listings: ChatListing[];
};

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://alex-nekasim.vercel.app"
  );
}

function listingFromProperty(p: Property, base: string): ChatListing {
  const pub = toPublicProperty(p);
  return {
    id: pub.id,
    title: pub.title,
    dealType: pub.dealType,
    neighborhood: pub.neighborhood,
    rooms: pub.rooms,
    priceLabel: formatPrice(pub.price),
    sizeSqm: pub.sizeSqm,
    propertyType: propertyTypeLabel(pub.propertyType),
    url: `${base}/properties/${pub.id}`,
    blurb: (pub.description || "").slice(0, 220),
  };
}

export async function buildChatContext(): Promise<ChatContext> {
  const base = siteUrl();
  let listings: ChatListing[] = [];

  if (hasDbConfig()) {
    try {
      const db = await connectDb();
      const rows = await db
        .select()
        .from(properties)
        .where(and(eq(properties.status, "published"), isNull(properties.deletedAt)));
      listings = rows
        .map(mapProperty)
        .filter(isListedPublicly)
        .map((p) => listingFromProperty(p, base));
    } catch (error) {
      console.error("chat context db", error);
    }
  }

  return {
    siteUrl: base,
    about: siteConfig.aboutShort,
    why: siteConfig.whyWorkWithAlex,
    phone: siteConfig.phone,
    whatsappUrl: `https://wa.me/${siteConfig.whatsapp}`,
    contactPath: `${base}/contact`,
    propertiesPath: `${base}/properties`,
    listings,
  };
}

export function contextToPromptBlock(ctx: ChatContext): string {
  const lines = ctx.listings.slice(0, 40).map((l, i) => {
    const size = l.sizeSqm ? `${l.sizeSqm} מ״ר` : "שטח לא צוין";
    return `${i + 1}. ${l.title} | ${dealTypeLabel(l.dealType)} | ${l.neighborhood} | ${l.rooms} חדרים | ${size} | ${l.priceLabel} | ${l.url}
תקציר: ${l.blurb || "—"}`;
  });

  return `מותג: ${siteConfig.brandName}
איש קשר: ${siteConfig.ownerFullName}
טלפון: ${ctx.phone}
WhatsApp: ${ctx.whatsappUrl}
אודות: ${ctx.about}
למה לעבוד עם אלכס: ${ctx.why.join("； ")}
עמוד נכסים: ${ctx.propertiesPath}
עמוד יצירת קשר: ${ctx.contactPath}

נכסים מפורסמים כרגע (${ctx.listings.length}):
${lines.length ? lines.join("\n") : "אין כרגע נכסים מפורסמים באתר."}`;
}
