import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { mapLead } from "@/lib/mappers";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDb();
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return NextResponse.json({ leads: rows.map(mapLead) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed", leads: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectDb();
    const body = await req.json();
    const {
      type,
      name,
      phone,
      message,
      propertyId,
      propertyTitle,
      propertyUrl,
      privacyConsentAt,
    } = body;

    if (!type || !name || !phone || !privacyConsentAt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const now = new Date();
    const [row] = await db
      .insert(leads)
      .values({
        id: crypto.randomUUID(),
        type: String(type),
        name: String(name),
        phone: String(phone),
        message: message != null ? String(message) : null,
        propertyId:
          typeof propertyId === "string" && propertyId.trim()
            ? propertyId.trim()
            : null,
        propertyTitle: propertyTitle != null ? String(propertyTitle) : null,
        propertyUrl: propertyUrl != null ? String(propertyUrl) : null,
        privacyConsentAt: new Date(privacyConsentAt),
        status: "new",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ lead: mapLead(row) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
