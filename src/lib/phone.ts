/** Normalize Israeli-style phone for tel: / wa.me */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function toWhatsAppNumber(phone: string): string | null {
  let n = digitsOnly(phone);
  if (!n) return null;
  if (n.startsWith("972")) return n;
  if (n.startsWith("0") && n.length >= 9) return `972${n.slice(1)}`;
  if (n.length === 9) return `972${n}`;
  return n;
}

export function telHref(phone: string): string {
  const n = digitsOnly(phone);
  if (n.startsWith("972")) return `tel:+${n}`;
  if (n.startsWith("0")) return `tel:+972${n.slice(1)}`;
  return `tel:${phone}`;
}

export function clientWhatsAppUrl(phone: string, text: string): string | null {
  const n = toWhatsAppNumber(phone);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
