import { LegalDraftNotice } from "@/components/legal/LegalDraftNotice";
import { siteConfig } from "@/lib/site";
import { accessibilityCoordinatorLines } from "@/lib/legal-display";

export const metadata = { title: "הצהרת נגישות" };

export default function AccessibilityPage() {
  const c = accessibilityCoordinatorLines();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">הצהרת נגישות</h1>
      <LegalDraftNotice />
      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          אתר {siteConfig.brandName} פועל ליישום התאמות נגישות בהתאם לחוק שוויון
          זכויות לאנשים עם מוגבלות, התשנ״ח-1998; לתקנות שוויון זכויות לאנשים עם
          מוגבלות (התאמות נגישות לשירות), התשע״ג-2013; ולתקן ישראלי ת״י 5568
          (בהתאמה ל־WCAG 2.0 ברמת AA), ככל האפשר באתר זה.
        </p>

        <section>
          <h2 className="font-display text-xl text-text">התאמות עיקריות באתר</h2>
          <ul className="mt-2 list-disc space-y-1 pe-5">
            <li>מבנה סמנטי, שפת עברית ו־RTL</li>
            <li>קישור דילוג לתוכן הראשי</li>
            <li>ניווט מקלדת וסימון מיקוד (focus) גלוי</li>
            <li>טקסט חלופי לתמונות נכס</li>
            <li>טפסים עם תוויות, הודעות שגיאה ויידוע פרטיות</li>
            <li>ניגודיות מותאמת על רקע כהה; תגיות על תמונות בניגודיות גבוהה</li>
            <li>תמיכה בזום דפדפן; כיבוד העדפת הפחתת תנועה במערכת</li>
            <li>הנגשה מובנית בקוד — לא רק תוסף צד־שלישי</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">מגבלות ידועות</h2>
          <p className="mt-2">
            ייתכנו פערים בתוכן חיצוני (למשל תמונות ישנות ללא תיאור מלא) או
            ברכיבים שעדיין בפיתוח. אנו משפרים באופן שוטף. בדיקת נגישות מלאה
            (מקלדת + כלי סריקה) תבוצע לפני עלייה עם לידים אמיתיים.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">רכז נגישות ופניות</h2>
          <p className="mt-2">
            {c.name}
            <br />
            טלפון:{" "}
            <a href={`tel:${siteConfig.phoneTel}`} className="text-accent underline">
              {c.phone}
            </a>
            <br />
            דוא״ל:{" "}
            <a href={`mailto:${c.email}`} className="text-accent underline">
              {c.email}
            </a>
          </p>
          <p className="mt-2">
            נתקלתם בבעיית נגישות? אנא פנו אלינו עם תיאור העמוד והבעיה. נשתדל
            לתקן בהקדם ולספק מידע בדרך חלופית במידת הצורך.
          </p>
        </section>

        <p className="text-sm">תאריך הצהרה: {siteConfig.legalDraftUpdatedAt}</p>
      </div>
    </article>
  );
}
