import { LegalDraftNotice } from "@/components/legal/LegalDraftNotice";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "תנאי שימוש" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">תנאי שימוש</h1>
      <LegalDraftNotice />
      <div className="mt-8 space-y-6 leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-text">1. כללי</h2>
          <p className="mt-2">
            השימוש באתר {siteConfig.brandName} מהווה הסכמה לתנאים אלה. האתר מציג
            מידע על נכסי מגורים בירושלים לצורכי תיווך ואינו מהווה הצעה מחייבת
            או התחייבות לסגירת עסקה.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">2. תכנים וקניין רוחני</h2>
          <p className="mt-2">
            תכנים, תמונות ועיצוב באתר מוגנים. אין להעתיק, להפיץ או לעשות שימוש
            מסחרי ללא אישור מראש ובכתב.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">3. פרסום נכסים</h2>
          <p className="mt-2">
            פרסום נכסים לציבור נעשה רק על ידי אלכס. טופס &quot;יש לי נכס&quot; הוא פנייה
            בלבד ואינו מקנה הרשאת פרסום עצמית.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">4. חשבונות משתמש</h2>
          <p className="mt-2">
            הרשמה נועדה לשמירת מועדפים. אתם אחראים לשמירת פרטי ההתחברות. ניתן
            לבקש מחיקת חשבון דרך ערוץ הפרטיות המפורט במדיניות הפרטיות.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">5. דיוק מידע והגבלת אחריות</h2>
          <p className="mt-2">
            מחירים, זמינות ותיאורים כפופים לשינוי. לפרטים נוספים ראו את{" "}
            <a href="/disclaimer" className="text-accent underline">
              הדיסקליימר
            </a>
            . עסקאות נדל״ן מתבצעות בכפוף לדין, לרבות חוק המתווכים במקרקעין,
            ורק בתיאום עם אלכס.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">6. שימוש אסור</h2>
          <p className="mt-2">
            אין לפגוע בפעילות האתר, לנסות גישה לא מורשית, או למסור מידע כוזב
            בטפסים.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">7. דין וסמכות</h2>
          <p className="mt-2">
            על התנאים יחול דין מדינת ישראל, ובכפוף לדין — סמכות השיפוט בישראל.
          </p>
        </section>
      </div>
    </article>
  );
}
