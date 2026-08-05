import Link from "next/link";
import { siteConfig } from "@/lib/site";

type Purpose = "lead" | "register";

const purposeText: Record<Purpose, string> = {
  lead: "מענה לפנייתכם, יצירת קשר ותיאום לגבי נכסים או שירותי תיווך.",
  register: "יצירת חשבון ושמירת רשימת נכסים מועדפים.",
};

interface Props {
  purpose: Purpose;
  id?: string;
}

/** יידוע בעת איסוף — חוק הגנת הפרטיות / תיקון 13 */
export function FormPrivacyNotice({ purpose, id = "privacy-collection-notice" }: Props) {
  return (
    <div
      id={id}
      className="rounded border border-border bg-bg-soft px-3 py-3 text-xs leading-relaxed text-text-muted"
    >
      <p>
        <span className="font-semibold text-text">יידוע בעת מסירת פרטים: </span>
        בעל השליטה במאגר — {siteConfig.dataControllerName}. מטרת האיסוף:{" "}
        {purposeText[purpose]} השדות המסומנים כחובה נדרשים לטיפול בבקשה; בלי
        מסירתם לא ניתן לשלוח את הטופס. אי-הסכמה אינה מונעת צפייה בנכסים
        הציבוריים. זכויות עיון, תיקון ומחיקה — פנו ל־
        <a
          href={`mailto:${siteConfig.privacyRequestsEmail}`}
          className="text-accent underline"
        >
          {siteConfig.privacyRequestsEmail}
        </a>
        . פירוט מלא ב־
        <Link href="/privacy" className="text-accent underline">
          מדיניות הפרטיות
        </Link>
        .
      </p>
    </div>
  );
}
