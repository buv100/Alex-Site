import { siteConfig } from "@/lib/site";

export function licenseDisplay(): string {
  if (siteConfig.licenseNumber) {
    const holder = siteConfig.licenseHolderName
      ? ` · ${siteConfig.licenseHolderName}`
      : "";
    return `רישיון תיווך מס׳ ${siteConfig.licenseNumber}${holder}`;
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
