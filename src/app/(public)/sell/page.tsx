import { LeadForm } from "@/components/forms/LeadForm";

export const metadata = { title: "יש לי נכס" };

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-accent">יש לי נכס לפרסום</h1>
      <p className="mt-3 text-text-muted">
        מוכרים ומשכירים — השאירו פרטים. רק אלכס מפרסם נכסים באתר אחרי בדיקה.
      </p>
      <div className="mt-10 rounded border border-border bg-bg-elevated p-5">
        <LeadForm
          type="seller"
          title="פרטים ליצירת קשר לגבי פרסום נכס"
        />
      </div>
    </div>
  );
}
