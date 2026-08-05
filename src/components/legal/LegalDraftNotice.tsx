import { siteConfig } from "@/lib/site";

/** Banner on legal pages — drafts pending attorney review */
export function LegalDraftNotice() {
  return (
    <aside
      className="mt-4 rounded border border-accent/40 bg-accent-dim px-4 py-3 text-sm text-text"
      role="note"
    >
      <p>
        טיוטה משפטית בסיסית לעמידה בדרישות גילוי.{" "}
        <strong className="font-semibold">אינה ייעוץ משפטי</strong> ואינה מחליפה
        אישור עו״ד לפני איסוף לידים אמיתיים.
      </p>
      <p className="mt-1 text-text-muted">
        עודכן לאחרונה: {siteConfig.legalDraftUpdatedAt} · פרטי עוסק / רישיון /
        רכז נגישות יושלמו כשיתקבלו.
      </p>
    </aside>
  );
}
