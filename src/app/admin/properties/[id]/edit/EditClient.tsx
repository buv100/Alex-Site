"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo } from "@/components/providers/DemoProvider";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getAdminDict } from "@/lib/i18n/admin";

export default function EditClient() {
  const params = useParams<{ id: string }>();
  const { getPropertyById, ready, adminLocale } = useDemo();
  const t = getAdminDict(adminLocale);
  const property = ready ? getPropertyById(params.id) : undefined;

  if (!ready) return <p className="text-text-muted">…</p>;
  if (!property) {
    return (
      <div>
        <p>לא נמצא</p>
        <Link href="/admin/properties">{t.back}</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-accent">{t.edit}</h1>
        <Link href="/admin/properties" className="text-sm text-text-muted">
          {t.back}
        </Link>
      </div>
      <PropertyForm initial={property} />
    </div>
  );
}
