import { siteConfig } from "@/lib/site";

export const metadata = { title: "תנאי שימוש" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-text-muted">
      <h1 className="font-display text-4xl text-accent">תנאי שימוש</h1>
      <p className="mt-2 text-sm">טיוטה בסיסית לדמו.</p>
      <div className="mt-8 space-y-4 leading-relaxed">
        <p>
          השימוש באתר {siteConfig.brandName} מהווה הסכמה לתנאים אלה. האתר מציג מידע על
          נכסים לצורכי תיווך ואינו מהווה הצעה מחייבת.
        </p>
        <p>
          אין להעתיק תכנים או תמונות ללא אישור. פרסום נכסים לציבור נעשה רק על ידי אלכס.
        </p>
        <p>
          עסקאות נדל״ן מתבצעות בכפוף לדין ולחוק המתווכים במקרקעין. מחירים וזמינות
          כפופים לשינוי.
        </p>
      </div>
    </article>
  );
}
