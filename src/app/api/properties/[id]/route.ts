import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { PropertyModel } from "@/lib/models/Property";
import { mapProperty } from "@/lib/mappers";
import { toPublicProperty } from "@/lib/property-public";
import { isArchivedPublicly, isListedPublicly } from "@/lib/property-public";
import mongoose from "mongoose";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id) && !id.startsWith("p")) {
      // still try find by id string for seed migration later
    }
    await connectDb();
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    const doc = await PropertyModel.findById(id);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const property = mapProperty(doc);
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
    await connectDb();
    const body = await req.json();
    const {
      id: _i,
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
      if (!rest.publishedAt) rest.publishedAt = new Date();
    }

    if (rest.status === "sold" || rest.status === "rented") {
      rest.archivedAt = new Date();
    }

    const doc = await PropertyModel.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ property: mapProperty(doc) });
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
    await connectDb();
    const doc = await PropertyModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ property: mapProperty(doc) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
