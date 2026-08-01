import { siteConfig } from "@/lib/site";

export const metadata = { title: "הצהרת נגישות" };

export default function AccessibilityPage() {
  const c = siteConfig.accessibilityCoordinator;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">הצהרת נגישות</h1>
      <div className="mt-8 space-y-4 leading-relaxed">
        <p>
          אתר {siteConfig.brandName} פועל ליישום התאמות נגישות בהתאם לתקנות שוויון
          זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות) ולתקן ישראלי ת״י 5568
          (בהתאמה ל־WCAG 2.0 ברמת AA), ככל האפשר.
        </p>
        <h2 className="font-display text-xl text-text">התאמות עיקריות</h2>
        <ul className="list-disc space-y-1 pe-5">
          <li>ניווט מקלדת ודילוג לתוכן</li>
          <li>טקסט חלופי לתמונות</li>
          <li>טפסים עם תוויות</li>
          <li>ניגודיות מותאמת על רקע כהה</li>
          <li>תמיכה ב־RTL וזום דפדפן</li>
        </ul>
        <h2 className="font-display text-xl text-text">רכז נגישות</h2>
        <p>
          {c.name}
          <br />
          טלפון: {c.phone}
          <br />
          דוא״ל: {c.email}
        </p>
        <p>
          נתקלתם בבעיית נגישות? אנא פנו אלינו ונשתדל לתקן בהקדם, ולספק מידע בדרך חלופית
          במידת הצורך.
        </p>
      </div>
    </article>
  );
}
