import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Edge-safe auth config (no DB imports). Used by middleware + full auth.
 */
export const authConfig = {
  trustHost: true,
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

        if (username === adminUser && adminPassword && password === adminPassword) {
          return {
            id: "admin",
            name: "אלכס",
            email: process.env.ADMIN_EMAIL || "admin@alex-nekasim.local",
            role: "admin",
          };
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

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "user";
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as string | undefined;
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
