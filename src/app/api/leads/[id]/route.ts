import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { mapLead } from "@/lib/mappers";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const db = await connectDb();
    const [row] = await db
      .update(leads)
      .set({
        status: String(body.status),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ lead: mapLead(row) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
