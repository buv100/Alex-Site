import Link from "next/link";
import { siteConfig } from "@/lib/site";
import {
  buildWhatsAppUrl,
  generalWhatsAppMessage,
} from "@/lib/whatsapp";
import { HomeListings } from "@/components/home/HomeListings";

export default function HomePage() {
  const wa = buildWhatsAppUrl(generalWhatsAppMessage());

  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border">
        <div className="mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:justify-center sm:pb-24">
          <p className="animate-fade-up text-sm uppercase tracking-[0.2em] text-accent">
            ירושלים · מכירה והשכרה
          </p>
          <h1 className="animate-fade-up font-display mt-4 max-w-3xl text-5xl leading-tight text-text sm:text-6xl md:text-7xl">
            {siteConfig.brandName}
          </h1>
          <p className="animate-fade-up-delay mt-6 max-w-xl text-lg text-text-muted sm:text-xl">
            {siteConfig.aboutShort}
          </p>
          <div className="animate-fade-up-delay mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/properties" className="btn btn-primary">
              לצפייה בנכסים
            </Link>
            <a href={wa} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              וואטסאפ לאלכס
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-accent">למה לעבוד עם אלכס</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {siteConfig.whyWorkWithAlex.map((item) => (
            <li
              key={item}
              className="border-s-2 border-accent/60 bg-bg-elevated px-4 py-4 text-text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
        <Link href="/about" className="mt-6 inline-block text-accent underline">
          עוד על אלכס
        </Link>
      </section>

      <section className="border-y border-border bg-bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl">נכסים נבחרים</h2>
            <Link href="/properties" className="text-sm text-accent">
              לכל הנכסים
            </Link>
          </div>
          <HomeListings />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl">יש לכם נכס לפרסום?</h2>
        <p className="mx-auto mt-3 max-w-lg text-text-muted">
          אלכס מלווה גם מוכרים ומשכירים — השאירו פרטים ונחזור אליכם.
        </p>
        <Link href="/sell" className="btn btn-primary mt-8">
          יש לי נכס
        </Link>
      </section>
    </>
  );
}
