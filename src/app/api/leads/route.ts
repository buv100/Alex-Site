import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { LeadModel } from "@/lib/models/Lead";
import { mapLead } from "@/lib/mappers";
import mongoose from "mongoose";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const docs = await LeadModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ leads: docs.map(mapLead) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed", leads: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
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

    const doc = await LeadModel.create({
      type,
      name,
      phone,
      message: message ?? null,
      propertyId:
        propertyId && mongoose.Types.ObjectId.isValid(propertyId)
          ? propertyId
          : null,
      propertyTitle: propertyTitle ?? null,
      propertyUrl: propertyUrl ?? null,
      privacyConsentAt: new Date(privacyConsentAt),
      status: "new",
    });

    return NextResponse.json({ lead: mapLead(doc) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
