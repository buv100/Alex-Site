"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getAdminDict } from "@/lib/i18n/admin";

export default function NewPropertyPage() {
  const { createPropertyDraft, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const property = useMemo(
    () => createPropertyDraft({ title: "" }),
    // one draft per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-accent">{t.newProperty}</h1>
        <Link href="/admin/properties" className="text-sm text-text-muted">
          {t.back}
        </Link>
      </div>
      <PropertyForm initial={property} />
    </div>
  );
}
