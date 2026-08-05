import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { licenseDisplay } from "@/lib/legal-display";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="font-display text-2xl text-accent">{siteConfig.brandName}</p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">{siteConfig.tagline}</p>
          <p className="mt-4 text-sm text-text-muted">{licenseDisplay()}</p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-text-muted">
            מחירים וזמינות כפופים לשינוי. המידע באתר אינו הצעה מחייבת. ראו{" "}
            <Link href="/disclaimer" className="text-accent underline">
              דיסקליימר
            </Link>
            .
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="קישורים משפטיים וניווט">
          <a href={`tel:${siteConfig.phoneTel}`} className="text-accent hover:underline">
            {siteConfig.phone}
          </a>
          <Link href="/contact" className="text-text-muted hover:text-accent">
            צור קשר
          </Link>
          <Link href="/privacy" className="text-text-muted hover:text-accent">
            מדיניות פרטיות
          </Link>
          <Link href="/cookies" className="text-text-muted hover:text-accent">
            מדיניות עוגיות
          </Link>
          <Link href="/terms" className="text-text-muted hover:text-accent">
            תנאי שימוש
          </Link>
          <Link href="/accessibility" className="text-text-muted hover:text-accent">
            הצהרת נגישות
          </Link>
          <Link href="/disclaimer" className="text-text-muted hover:text-accent">
            דיסקליימר
          </Link>
        </nav>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} {siteConfig.brandName}. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
