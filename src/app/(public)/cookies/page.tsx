import { LegalDraftNotice } from "@/components/legal/LegalDraftNotice";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "מדיניות עוגיות" };

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">מדיניות עוגיות</h1>
      <LegalDraftNotice />
      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          אתר {siteConfig.brandName} משתמש בעוגיות ובטכנולוגיות דומות הנדרשות
          להפעלת השירות. בשלב זה <strong className="font-semibold text-text">אין</strong>{" "}
          אנליטיקס או פיקסלים שיווקיים לא-חיוניים — ולכן אין באנר הסכמה לעוגיות
          שיווק.
        </p>

        <section>
          <h2 className="font-display text-xl text-text">עוגיות חיוניות</h2>
          <ul className="mt-2 list-disc space-y-1 pe-5">
            <li>
              עוגיות session להתחברות אדמין / משתמש (אבטחה, אינן מיועדות לפרסום)
            </li>
            <li>
              במצב דמו מקומי — נתונים ב־localStorage בדפדפן בלבד (אינם עוגיות
              צד־שלישי)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">עוגיות לא-חיוניות</h2>
          <p className="mt-2">
            אם בעתיד יוטמע אנליטיקס או כלי מדידה שאינם חיוניים — יופעל מנגנון
            הסכמה לפני הפעלה, בהתאם למדיניות הפרטיות ולדין.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-text">ניהול בדפדפן</h2>
          <p className="mt-2">
            ניתן לחסום או למחוק עוגיות דרך הגדרות הדפדפן. חסימת עוגיות חיוניות
            עלולה למנוע התחברות או שמירת מצב.
          </p>
        </section>

        <p>
          למידע נוסף:{" "}
          <a href="/privacy" className="text-accent underline">
            מדיניות פרטיות
          </a>
          .
        </p>
      </div>
    </article>
  );
}
