import { siteConfig } from "@/lib/site";

export const metadata = { title: "דיסקליימר" };

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">דיסקליימר</h1>
      <div className="mt-8 space-y-4 leading-relaxed">
        <p>
          המידע באתר {siteConfig.brandName}, לרבות מחירים, זמינות ותיאורי נכסים, מוצג
          לצורכי מידע כללי בלבד וכפוף לשינויים. אין לראות בו הצעה מחייבת או ייעוץ משפטי /
          שמאי.
        </p>
        <p>
          כתובות מוצגות עד רמת שם רחוב בלבד. פרטים מדויקים נמסרים בתיאום עם אלכס.
        </p>
        <p>
          עסקאות מתבצעות רק באמצעות אלכס ובכפוף להוראות הדין, לרבות חוק המתווכים
          במקרקעין.
        </p>
      </div>
    </article>
  );
}
