import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role === "admin") {
    return NextResponse.json({ favorites: [] });
  }

  try {
    const db = await connectDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);
    return NextResponse.json({
      favorites: user?.favorites ?? [],
    });
  } catch {
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await req.json();
    if (!propertyId || typeof propertyId !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await connectDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const current = user.favorites ?? [];
    const has = current.includes(propertyId);
    const favorites = has
      ? current.filter((f) => f !== propertyId)
      : [...current, propertyId];

    await db
      .update(users)
      .set({ favorites, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
