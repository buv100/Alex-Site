import { dealTypeLabel } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { ChatContext, ChatListing } from "@/lib/chat/context";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[״"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function filterListings(ctx: ChatContext, q: string): ChatListing[] {
  let list = [...ctx.listings];
  const n = normalize(q);

  if (/שכר|השכר|להשכיר|שכירות|rent/i.test(n)) {
    list = list.filter((l) => l.dealType === "rent");
  } else if (/מכיר|למכור|לקנות|קני|sale/i.test(n)) {
    list = list.filter((l) => l.dealType === "sale");
  }

  const neighborhoodHit = siteConfig.neighborhoods.find((nb) =>
    n.includes(normalize(nb)),
  );
  if (neighborhoodHit) {
    list = list.filter((l) => normalize(l.neighborhood).includes(normalize(neighborhoodHit)));
  }

  const roomsMatch = n.match(/(\d+(?:\.\d)?)\s*חדר/);
  if (roomsMatch) {
    const rooms = Number(roomsMatch[1]);
    if (Number.isFinite(rooms)) {
      list = list.filter((l) => Math.abs(l.rooms - rooms) < 0.6);
    }
  }

  return list;
}

function formatList(list: ChatListing[], limit = 5): string {
  if (!list.length) {
    return "לא מצאתי נכסים פעילים שמתאימים במדויק. אפשר לעיין בכל הנכסים באתר או לכתוב לאלכס בוואטסאפ.";
  }
  return list
    .slice(0, limit)
    .map(
      (l, i) =>
        `${i + 1}. ${l.title} — ${dealTypeLabel(l.dealType)}, ${l.neighborhood}, ${l.rooms} חדרים, ${l.priceLabel}\n${l.url}`,
    )
    .join("\n\n");
}

export function localChatReply(question: string, ctx: ChatContext): string {
  const q = normalize(question);
  if (!q) {
    return "אפשר לשאול אותי על דירות למכירה/השכרה, שכונות, או על אלכס. במה אפשר לעזור?";
  }

  if (/וואטסאפ|whatsapp|טלפון|להתקשר|צור קשר|ליצור קשר/.test(q)) {
    return `אפשר ליצור קשר עם אלכס בטלפון ${ctx.phone} או בוואטסאפ:\n${ctx.whatsappUrl}\nאו דרך ${ctx.contactPath}`;
  }

  if (/מי זה אלכס|על אלכס|מי אתה|למה לעבוד|ניסיון|נסיון|שפות/.test(q)) {
    return `${ctx.about}\n\n• ${ctx.why.join("\n• ")}\n\nליצירת קשר: ${ctx.phone} / ${ctx.whatsappUrl}`;
  }

  if (/רישיון|מתווך/.test(q)) {
    return `אלכס גריביאן הוא מתווך מורשה. מספר הרישיון מופיע באתר (פוטר / אודות). לשאלות נוספות: ${ctx.whatsappUrl}`;
  }

  if (/מחיר|כמה עולה|תקציב/.test(q) && !ctx.listings.length) {
    return `כרגע אין נכסים מפורסמים להצגת מחירים. אפשר ליצור קשר לבירור: ${ctx.whatsappUrl}`;
  }

  if (
    /נכס|דיר|שכונ|מכיר|שכר|השכר|רחביה|קטמון|בקעה|טלביה|נחלאות|גילה|רמות|יובל|ארנונה|פנטהאוז|חדר/.test(
      q,
    ) ||
    siteConfig.neighborhoods.some((nb) => q.includes(normalize(nb)))
  ) {
    const matched = filterListings(ctx, question);
    const intro =
      matched.length === ctx.listings.length && ctx.listings.length > 0
        ? `יש כרגע ${ctx.listings.length} נכסים מפורסמים:`
        : "הנה מה שמצאתי לפי מה שכתבת:";
    return `${intro}\n\n${formatList(matched)}\n\nכל הנכסים: ${ctx.propertiesPath}\nלתיאום או מו״מ — וואטסאפ לאלכס: ${ctx.whatsappUrl}`;
  }

  if (/שלום|היי|hey|hi\b|בוקר|ערב/.test(q)) {
    return `שלום! אני העוזר של ${siteConfig.brandName}. אפשר לשאול על דירות בירושלים, שכונות, או על אלכס — ואם צריך עסקה אמיתית נעבור לוואטסאפ עם אלכס.`;
  }

  return `תודה על השאלה. אני יכול לעזור במידע ציבורי על נכסים באתר ועל אלכס.\n\nנסה למשל: "דירות למכירה ברחביה", "מה יש להשכרה?", או "מי זה אלכס?".\n\nלשיחה ישירה עם אלכס: ${ctx.whatsappUrl}`;
}
