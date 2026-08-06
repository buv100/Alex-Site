import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const db = await connectDb();
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

    const phoneTrim = phone.trim();
    const [exists] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phone, phoneTrim))
      .limit(1);

    if (exists) {
      return NextResponse.json(
        { error: "מספר הטלפון כבר רשום" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const [user] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name: name.trim(),
        phone: phoneTrim,
        passwordHash,
        role: "user",
        favorites: [],
        privacyConsentAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({
      user: {
        id: user.id,
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
