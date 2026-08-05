import { siteConfig } from "@/lib/site";

/** תקנות המתווכים — חובת ציון שם, היותו מתווך ומספר רישיון בפרסום שיווקי */
export function brokerMarketingLine(): string {
  const license = siteConfig.licenseNumber
    ? `מס׳ רישיון ${siteConfig.licenseNumber}`
    : "רישיון תיווך";
  return `${siteConfig.ownerFullName} · מתווך במקרקעין · ${license}`;
}

export function licenseDisplay(): string {
  if (siteConfig.licenseNumber) {
    const holder = siteConfig.licenseHolderName
      ? ` · ${siteConfig.licenseHolderName}`
      : "";
    return `רישיון תיווך במקרקעין מס׳ ${siteConfig.licenseNumber}${holder}`;
  }
  return "מספר רישיון תיווך יוצג כאן עם קבלת הפרטים מאלכס";
}

export function accessibilityCoordinatorLines(): {
  name: string;
  phone: string;
  email: string;
} {
  const c = siteConfig.accessibilityCoordinator;
  return {
    name: c.name ?? "שם רכז הנגישות יושלם בהמשך",
    phone: c.phone ?? siteConfig.phone,
    email: c.email,
  };
}

/** Private fields that must never appear in public HTML/API payloads */
export const PRIVATE_PROPERTY_FIELDS = [
  "ownerName",
  "ownerPhone",
  "ownerNotes",
  "minPriceNegotiable",
  "internalNotes",
  "exactAddress",
] as const;
