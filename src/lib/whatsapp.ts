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

/** Prefill for Alex when a visitor submits the on-site lead form */
export function formLeadWhatsAppMessage(opts: {
  type: string;
  name: string;
  phone: string;
  message?: string | null;
  propertyTitle?: string | null;
  propertyUrl?: string | null;
}): string {
  const typeLabel =
    opts.type === "seller"
      ? "יש לי נכס"
      : opts.type === "property"
        ? "פנייה לנכס"
        : "פנייה כללית";
  const lines = [
    `פנייה חדשה מהאתר (${typeLabel})`,
    `שם: ${opts.name}`,
    `טלפון: ${opts.phone}`,
  ];
  if (opts.propertyTitle) {
    lines.push(`נכס: ${opts.propertyTitle}`);
  }
  if (opts.propertyUrl) {
    lines.push(`קישור: ${opts.propertyUrl}`);
  }
  if (opts.message?.trim()) {
    lines.push(`הודעה: ${opts.message.trim()}`);
  }
  lines.push(`(${brokerMarketingLine()})`);
  return lines.join("\n");
}
