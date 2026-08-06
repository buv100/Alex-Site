import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { authConfig } from "@/auth.config";
import { connectDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "user",
      name: "User",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const phone = String(credentials?.phone ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!phone || !password) return null;

        const db = await connectDb();
        const [user] = await db
          .select()
          .from(users)
          .where(and(eq(users.phone, phone), eq(users.role, "user")))
          .limit(1);
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: "user",
          phone: user.phone,
        };
      },
    }),
  ],
});
