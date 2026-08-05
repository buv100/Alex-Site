import { LegalDraftNotice } from "@/components/legal/LegalDraftNotice";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "מדיניות פרטיות" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">מדיניות פרטיות</h1>
      <LegalDraftNotice />
      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          אתר {siteConfig.brandName} (&quot;האתר&quot;) מופעל לצורכי תיווך נדל״ן בירושלים.
          מדיניות זו מתארת איסוף ועיבוד מידע אישי בהתאם לחוק הגנת הפרטיות,
          התשמ״א-1981, לרבות תיקון 13. בעל השליטה במאגר:{" "}
          {siteConfig.dataControllerName}.
        </p>

        <section>
          <h2 className="font-display text-xl text-text">1. איזה מידע נאסף</h2>
          <ul className="mt-2 list-disc space-y-1 pe-5">
            <li>שם ומספר טלפון בטפסי יצירת קשר, &quot;יש לי נכס&quot; והרשמה</li>
            <li>הודעה חופשית שתשלחו בטופס (אם תבחרו)</li>
            <li>רשימת נכסים מועדפים למשתמשים רשומים</li>
            <li>
              מידע טכני חיוני להפעלת האתר (למשל עוגיות session מאובטחות) — ראו{" "}
              <a href="/cookies" className="text-accent underline">
                מדיניות עוגיות
              </a>
            </li>
          </ul>
          <p className="mt-2">
            איננו אוספים במכוון מידע שאינו נחוץ למטרות אלה. פרטי בעלי נכסים פנימיים
            וכתובת מדויקת אינם מוצגים לציבור.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">2. מטרות העיבוד</h2>
          <ul className="mt-2 list-disc space-y-1 pe-5">
            <li>מענה לפניות ותיאום לגבי נכסים ושירותי תיווך</li>
            <li>טיפול בבקשות מוכרים פוטנציאליים</li>
            <li>ניהול חשבון מועדפים</li>
            <li>עמידה בחובות חוקיות ואבטחת האתר</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">3. בסיס ומסירה מרצון</h2>
          <p className="mt-2">
            מסירת מידע בטפסים היא מרצון. בלי סימון הסכמה למדיניות זו לא ניתן לשלוח
            טופס. אי-הסכמה אינה מונעת צפייה בנכסים ציבוריים או שימוש בקישורי
            WhatsApp / טלפון שאינם דורשים טופס באתר.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">4. שיתוף והעברה לחו״ל</h2>
          <p className="mt-2">
            המידע עשוי להיות מעובד אצל ספקי תשתית תפעוליים (למשל אירוח אתר, מסד
            נתונים ואחסון תמונות) שחלקם ממוקמים מחוץ לישראל. השימוש נעשה לצורך
            הפעלת האתר בלבד ולא למכירת מידע לצדדים שלישיים לצורכי שיווק. ייתכן
            שיתוף אם נדרש לפי דין.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">5. זכויותיכם</h2>
          <p className="mt-2">
            בהתאם לדין, ניתן לבקש עיון, תיקון או מחיקה של מידע אישי. פנו בכתב ל־
            <a
              href={`mailto:${siteConfig.privacyRequestsEmail}`}
              className="text-accent underline"
            >
              {siteConfig.privacyRequestsEmail}
            </a>
            . נטפל בבקשה בהקדם האפשרי ובאופן ידני בשלב זה.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">6. אבטחה ושמירה</h2>
          <p className="mt-2">
            אנו נוקטים באמצעים סבירים להגנה על המידע (הצפנת תעבורה, הגבלת גישה,
            סיסמאות ב־hash). משך השמירה — כל עוד נדרש למטרות שלשמן נאסף,
            או לפי דין.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">7. קטינים</h2>
          <p className="mt-2">
            האתר אינו מיועד לאיסוף מידע מקטינים. אם נתגלה מידע כזה בטעות — נמחק
            לפי פנייה.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">8. עדכונים</h2>
          <p className="mt-2">
            מדיניות זו עשויה להתעדכן. תאריך העדכון יופיע בראש העמוד. שימוש
            מתמשך באתר לאחר עדכון מהווה הסכמה לנוסח העדכני, בכפוף לדין.
          </p>
        </section>
      </div>
    </article>
  );
}
