import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { mapProperty, propertyValuesFromBody } from "@/lib/mappers";
import {
  isArchivedPublicly,
  isListedPublicly,
  toPublicProperty,
} from "@/lib/property-public";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const db = await connectDb();
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    const [row] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const property = mapProperty(row);
    if (isAdmin) {
      return NextResponse.json({ property });
    }

    if (property.deletedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isListedPublicly(property) && !isArchivedPublicly(property)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ property: toPublicProperty(property) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
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

    if (values.status === "sold" || values.status === "rented") {
      values.archivedAt = values.archivedAt ?? new Date();
    }

    const [row] = await db
      .update(properties)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ property: mapProperty(row) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
    const db = await connectDb();
    const [row] = await db
      .update(properties)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ property: mapProperty(row) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
