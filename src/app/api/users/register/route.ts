import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDb();
    const body = await req.json();
    const { name, phone, password, privacyConsent } = body;

    if (!privacyConsent) {
      return NextResponse.json(
        { error: "יש לאשר את מדיניות הפרטיות" },
        { status: 400 },
      );
    }
    if (!name?.trim() || !phone?.trim() || !password || password.length < 4) {
      return NextResponse.json(
        { error: "מלאו שם, טלפון וסיסמה (לפחות 4 תווים)" },
        { status: 400 },
      );
    }

    const exists = await UserModel.findOne({ phone: phone.trim() });
    if (exists) {
      return NextResponse.json(
        { error: "מספר הטלפון כבר רשום" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name: name.trim(),
      phone: phone.trim(),
      passwordHash,
      role: "user",
      favorites: [],
      privacyConsentAt: new Date(),
    });

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        phone: user.phone,
        favorites: [],
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
