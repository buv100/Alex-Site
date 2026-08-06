import { NextResponse } from "next/server";
import { desc, eq, isNull } from "drizzle-orm";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { mapProperty, propertyValuesFromBody } from "@/lib/mappers";
import {
  isArchivedPublicly,
  isListedPublicly,
  toPublicProperty,
} from "@/lib/property-public";

export async function GET(req: Request) {
  try {
    const db = await connectDb();
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "public";
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    const rows =
      scope === "admin" && isAdmin
        ? await db.select().from(properties).orderBy(desc(properties.updatedAt))
        : await db
            .select()
            .from(properties)
            .where(isNull(properties.deletedAt))
            .orderBy(desc(properties.updatedAt));

    const mapped = rows.map(mapProperty);

    if (scope === "admin" && isAdmin) {
      return NextResponse.json({ properties: mapped });
    }

    if (scope === "archive") {
      return NextResponse.json({
        properties: mapped.filter(isArchivedPublicly).map(toPublicProperty),
      });
    }

    const list = mapped.filter(isListedPublicly).map(toPublicProperty);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return NextResponse.json({ properties: list });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load properties", properties: [] },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDb();
    const body = (await req.json()) as Record<string, unknown>;
    const values = propertyValuesFromBody(body);

    if (values.status === "published") {
      if (values.images.length < 1) {
        return NextResponse.json(
          { error: "cannot_publish_no_image" },
          { status: 400 },
        );
      }
      values.publishedAt = values.publishedAt ?? new Date();
    }

    const now = new Date();
    const [row] = await db
      .insert(properties)
      .values({
        id: crypto.randomUUID(),
        ...values,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ property: mapProperty(row) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
