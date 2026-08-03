import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { PropertyModel } from "@/lib/models/Property";
import { LeadModel } from "@/lib/models/Lead";
import { seedLeads, seedProperties } from "@/data/seed";

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
    await connectDb();
    const count = await PropertyModel.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: "DB already has properties",
      });
    }

    for (const p of seedProperties) {
      const { id: _id, createdAt, updatedAt, ...rest } = p;
      await PropertyModel.create({
        ...rest,
        publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
        archivedAt: rest.archivedAt ? new Date(rest.archivedAt) : null,
        deletedAt: rest.deletedAt ? new Date(rest.deletedAt) : null,
      });
    }

    for (const l of seedLeads) {
      const { id: _id, createdAt, updatedAt, propertyId, ...rest } = l;
      await LeadModel.create({
        ...rest,
        propertyId: null,
        privacyConsentAt: new Date(rest.privacyConsentAt),
      });
    }

    return NextResponse.json({ ok: true, seeded: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
