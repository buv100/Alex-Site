import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/lib/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // Fallback so local demo works before .env is configured
  secret:
    process.env.AUTH_SECRET ||
    "dev-only-alex-nekasim-change-me-before-production",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!username || !password) return null;

        const adminUser = process.env.ADMIN_USERNAME || "alex";
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        // Local demo credentials (Phase 1) — disabled when ADMIN_PASSWORD is set
        if (
          !adminPassword &&
          !adminHash &&
          username === "alex" &&
          password === "alex-demo-2026"
        ) {
          return {
            id: "admin",
            name: "אלכס",
            email: "admin@alex-nekasim.local",
            role: "admin",
          };
        }

        if (username === adminUser && adminPassword) {
          if (password === adminPassword) {
            return {
              id: "admin",
              name: "אלכס",
              email: process.env.ADMIN_EMAIL || "admin@alex-nekasim.local",
              role: "admin",
            };
          }
        }

        if (username === adminUser && adminHash) {
          const ok = await bcrypt.compare(password, adminHash);
          if (ok) {
            return {
              id: "admin",
              name: "אלכס",
              email: process.env.ADMIN_EMAIL || "admin@alex-nekasim.local",
              role: "admin",
            };
          }
        }

        // Optional: admin user stored in Mongo
        try {
          await connectDb();
          const user = await UserModel.findOne({
            phone: username,
            role: "admin",
          });
          if (user && (await bcrypt.compare(password, user.passwordHash))) {
            return {
              id: String(user._id),
              name: user.name,
              email: user.email ?? undefined,
              role: "admin",
            };
          }
        } catch {
          /* mongo may be unavailable during setup */
        }

        return null;
      },
    }),
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

        await connectDb();
        const user = await UserModel.findOne({ phone, role: "user" });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          name: user.name,
          email: user.email ?? undefined,
          role: "user",
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "user";
        token.phone = (user as { phone?: string }).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { phone?: string }).phone = token.phone as
          | string
          | undefined;
      }
      return session;
    },
  },
});
