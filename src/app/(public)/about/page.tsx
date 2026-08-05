import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { licenseDisplay } from "@/lib/legal-display";

export const metadata = { title: "על אלכס" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-accent">על אלכס</h1>
      <p className="mt-2 text-lg text-accent">{siteConfig.ownerFullName}</p>
      <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-text-muted">
        {siteConfig.aboutLong}
      </p>
      <h2 className="font-display mt-10 text-2xl">למה כדאי לעבוד איתו</h2>
      <ul className="mt-4 list-disc space-y-2 pe-5 text-text-muted">
        {siteConfig.whyWorkWithAlex.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-text-muted">{licenseDisplay()}</p>
      <Link href="/contact" className="btn btn-primary mt-8">
        צור קשר
      </Link>
    </div>
  );
}
