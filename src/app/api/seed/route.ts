import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { leads, properties } from "@/lib/db/schema";
import { demoCatalogLeads, demoCatalogProperties } from "@/data/demo-catalog";
import { propertyValuesFromBody } from "@/lib/mappers";

export async function POST(req: Request) {
  const session = await auth();
  const secret = req.headers.get("x-seed-secret");
  const allowed =
    session?.user?.role === "admin" ||
    (process.env.SEED_SECRET && secret === process.env.SEED_SECRET);

  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDb();
    const existing = await db.select({ id: properties.id }).from(properties).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: "DB already has properties",
      });
    }

    for (const p of demoCatalogProperties) {
      const { id: _id, createdAt, updatedAt, ...rest } = p;
      const values = propertyValuesFromBody(rest as unknown as Record<string, unknown>);
      const now = new Date();
      await db.insert(properties).values({
        id: crypto.randomUUID(),
        ...values,
        publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
        archivedAt: rest.archivedAt ? new Date(rest.archivedAt) : null,
        deletedAt: rest.deletedAt ? new Date(rest.deletedAt) : null,
        createdAt: createdAt ? new Date(createdAt) : now,
        updatedAt: updatedAt ? new Date(updatedAt) : now,
      });
    }

    for (const l of demoCatalogLeads) {
      const { id: _id, createdAt, updatedAt, propertyId: _pid, ...rest } = l;
      const now = new Date();
      await db.insert(leads).values({
        id: crypto.randomUUID(),
        type: rest.type,
        name: rest.name,
        phone: rest.phone,
        message: rest.message ?? null,
        propertyId: null,
        propertyTitle: rest.propertyTitle ?? null,
        propertyUrl: rest.propertyUrl ?? null,
        status: rest.status,
        privacyConsentAt: new Date(rest.privacyConsentAt),
        createdAt: createdAt ? new Date(createdAt) : now,
        updatedAt: updatedAt ? new Date(updatedAt) : now,
      });
    }

    return NextResponse.json({ ok: true, seeded: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
