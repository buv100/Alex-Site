import { siteConfig } from "@/lib/site";

export const metadata = { title: "מדיניות פרטיות" };

export default function PrivacyPage() {
  return (
    <article className="prose-legal mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">מדיניות פרטיות</h1>
      <p className="mt-2 text-sm">טיוטה בסיסית לדמו — לאישור משפטי לפני עלייה עם לידים אמיתיים.</p>
      <div className="mt-8 space-y-4 leading-relaxed">
        <p>
          אתר {siteConfig.brandName} (&quot;האתר&quot;) מופעל על ידי אלכס (בעל שליטה במאגר המידע,
          פרטים מלאים יושלמו). מדיניות זו מתארת איסוף ועיבוד מידע אישי בהתאם לחוק הגנת
          הפרטיות, התשמ״א-1981, לרבות תיקון 13.
        </p>
        <h2 className="font-display text-xl text-text">איזה מידע נאסף</h2>
        <ul className="list-disc space-y-1 pe-5">
          <li>שם ומספר טלפון בטפסי יצירת קשר / פרסום נכס / הרשמה</li>
          <li>הודעה חופשית שתשלחו בטופס</li>
          <li>רשימת נכסים מועדפים למשתמשים רשומים</li>
          <li>מידע טכני חיוני להפעלת האתר (למשל עוגיות session)</li>
        </ul>
        <h2 className="font-display text-xl text-text">מטרות</h2>
        <p>מענה לפניות, תיאום לגבי נכסים, ניהול חשבון מועדפים, ושיפור השירות.</p>
        <h2 className="font-display text-xl text-text">הסכמה</h2>
        <p>
          מסירת מידע בטפסים היא מרצון. בלי הסכמה למדיניות לא ניתן לשלוח טופס. אי-הסכמה
          אינה מונעת צפייה בנכסים ציבוריים.
        </p>
        <h2 className="font-display text-xl text-text">זכויותיכם</h2>
        <p>
          עיון, תיקון ומחיקה — פנו ל-{siteConfig.email}. נטפל בבקשה בהקדם האפשרי.
        </p>
        <h2 className="font-display text-xl text-text">אבטחה ושמירה</h2>
        <p>
          אנו נוקטים באמצעים סבירים להגנה על המידע. משך השמירה — כל עוד נדרש למטרות
          שלשמן נאסף או לפי דין.
        </p>
      </div>
    </article>
  );
}
