"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { useDemo } from "@/components/providers/DemoProvider";

const links = [
  { href: "/properties", label: "נכסים" },
  { href: "/archive", label: "מכרנו" },
  { href: "/about", label: "על אלכס" },
  { href: "/sell", label: "יש לי נכס" },
  { href: "/contact", label: "צור קשר" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useDemo();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-accent sm:text-2xl"
        >
          {siteConfig.brandName}
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="תפריט ראשי">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-text-muted transition hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={currentUser ? "/favorites" : "/auth/login"}
            className="text-sm text-accent"
          >
            {currentUser ? "מועדפים" : "התחברות"}
          </Link>
        </nav>

        <button
          type="button"
          className="btn btn-ghost min-h-11 px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "סגור" : "תפריט"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-border px-4 py-3 md:hidden"
          aria-label="תפריט נייד"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block min-h-12 py-3 text-text-muted"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={currentUser ? "/favorites" : "/auth/login"}
                className="block min-h-12 py-3 text-accent"
                onClick={() => setOpen(false)}
              >
                {currentUser ? "מועדפים" : "התחברות"}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
