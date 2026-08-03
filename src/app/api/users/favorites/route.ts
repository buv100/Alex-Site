import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/lib/models/User";
import mongoose from "mongoose";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role === "admin") {
    return NextResponse.json({ favorites: [] });
  }

  try {
    await connectDb();
    const user = await UserModel.findById(session.user.id);
    return NextResponse.json({
      favorites: (user?.favorites ?? []).map(String),
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
    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectDb();
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const id = new mongoose.Types.ObjectId(propertyId);
    const has = user.favorites.some(
      (f: mongoose.Types.ObjectId) => String(f) === propertyId,
    );
    if (has) {
      user.favorites = user.favorites.filter(
        (f: mongoose.Types.ObjectId) => String(f) !== propertyId,
      );
    } else {
      user.favorites.push(id);
    }
    await user.save();

    return NextResponse.json({
      favorites: user.favorites.map((f: mongoose.Types.ObjectId) => String(f)),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
