import { siteConfig } from "./site";
import { brokerMarketingLine } from "./legal-display";

export function buildWhatsAppUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${siteConfig.whatsapp}?text=${encoded}`;
}

export function propertyInquiryMessage(opts: {
  title: string;
  neighborhood: string;
  url: string;
}): string {
  return `שלום ${siteConfig.ownerFullName}, אני מעוניין/ת בנכס: ${opts.title}
שכונה: ${opts.neighborhood}
קישור: ${opts.url}
(${brokerMarketingLine()})`;
}

export function sharePropertyMessage(opts: {
  title: string;
  url: string;
}): string {
  return `${opts.title}
${opts.url}
${brokerMarketingLine()}`;
}

export function leadReplyMessage(opts: {
  name: string;
  propertyTitle?: string | null;
}): string {
  const about = opts.propertyTitle
    ? ` לגבי הנכס «${opts.propertyTitle}»`
    : "";
  return `שלום ${opts.name},${about} כאן ${siteConfig.ownerFullName}, מתווך במקרקעין.`;
}

export function generalWhatsAppMessage(): string {
  return `שלום ${siteConfig.ownerFullName}, אשמח ליצור קשר לגבי נדל״ן בירושלים.`;
}
