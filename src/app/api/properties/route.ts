import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { PropertyModel } from "@/lib/models/Property";
import { mapProperty } from "@/lib/mappers";
import { toPublicProperty } from "@/lib/property-public";
import { isArchivedPublicly, isListedPublicly } from "@/lib/property-public";

export async function GET(req: Request) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "public";
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    const docs = await PropertyModel.find(
      scope === "admin" && isAdmin ? {} : { deletedAt: null },
    ).sort({ updatedAt: -1 });

    const mapped = docs.map(mapProperty);

    if (scope === "admin" && isAdmin) {
      return NextResponse.json({ properties: mapped });
    }

    if (scope === "archive") {
      return NextResponse.json({
        properties: mapped.filter(isArchivedPublicly).map(toPublicProperty),
      });
    }

    // public: shuffle lightly server-side
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
    await connectDb();
    const body = await req.json();
    const {
      id: _id,
      createdAt: _c,
      updatedAt: _u,
      ...rest
    } = body as Record<string, unknown>;

    if (rest.status === "published") {
      const images = (rest.images as unknown[]) ?? [];
      if (images.length < 1) {
        return NextResponse.json(
          { error: "cannot_publish_no_image" },
          { status: 400 },
        );
      }
      rest.publishedAt = new Date();
    }

    const doc = await PropertyModel.create(rest);
    return NextResponse.json({ property: mapProperty(doc) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
