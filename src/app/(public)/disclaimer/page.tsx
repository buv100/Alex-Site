import { LegalDraftNotice } from "@/components/legal/LegalDraftNotice";
import { siteConfig } from "@/lib/site";
import { licenseDisplay } from "@/lib/legal-display";

export const metadata = { title: "דיסקליימר" };

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">דיסקליימר</h1>
      <LegalDraftNotice />
      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          המידע באתר {siteConfig.brandName}, לרבות מחירים, זמינות, תיאורי נכסים
          ותמונות, מוצג לצורכי מידע כללי בלבד וכפוף לשינויים בכל עת. אין לראות בו
          הצעה מחייבת, ייעוץ משפטי, שמאי או פיננסי.
        </p>
        <p>
          כתובות מוצגות ברמת עיר, שכונה ושם רחוב בלבד — ללא מספר בניין או דירה.
          פרטים מדויקים נמסרים בתיאום ישיר עם אלכס.
        </p>
        <p>
          כאשר מוצג &quot;צור קשר לבירור&quot; במקום מחיר — אין מחיר פומבי מוגדר באתר
          ויש לברר מול אלכס.
        </p>
        <p>
          עסקאות מתבצעות רק באמצעות אלכס ובכפוף להוראות הדין, לרבות חוק המתווכים
          במקרקעין. {licenseDisplay()}.
        </p>
        <p>
          קישורי WhatsApp / טלפון פותחים אמצעי תקשורת חיצוניים; השימוש בהם כפוף
          לתנאי אותם שירותים.
        </p>
      </div>
    </article>
  );
}
