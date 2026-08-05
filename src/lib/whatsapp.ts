import { siteConfig } from "./site";

export function buildWhatsAppUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${siteConfig.whatsapp}?text=${encoded}`;
}

export function propertyInquiryMessage(opts: {
  title: string;
  neighborhood: string;
  url: string;
}): string {
  return `שלום אלכס, אני מעוניין/ת בנכס: ${opts.title}
שכונה: ${opts.neighborhood}
קישור: ${opts.url}`;
}

export function sharePropertyMessage(opts: {
  title: string;
  url: string;
}): string {
  return `דירה מאלכס נכסים: ${opts.title}
${opts.url}`;
}

export function leadReplyMessage(opts: {
  name: string;
  propertyTitle?: string | null;
}): string {
  const about = opts.propertyTitle
    ? ` לגבי הנכס «${opts.propertyTitle}»`
    : "";
  return `שלום ${opts.name},${about} כאן אלכס מאלכס נכסים.`;
}

export function generalWhatsAppMessage(): string {
  return "שלום אלכס, אשמח ליצור קשר לגבי נדל״ן בירושלים.";
}
