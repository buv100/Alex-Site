import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/** Constant-time string compare (Edge-safe, no Node crypto). */
function safeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

function isProductionRuntime() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function adminIdentity() {
  return {
    id: "admin",
    name: "אלכס",
    email: process.env.ADMIN_EMAIL || "admin@alex-nekasim.local",
    role: "admin" as const,
  };
}

/**
 * Edge-safe auth config (no DB imports). Used by middleware + full auth.
 */
export const authConfig = {
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "dev-only-alex-nekasim-change-me-before-production"),
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

        const adminUser = process.env.ADMIN_USERNAME?.trim();
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        // Production: never fall open — require env credentials.
        if (isProductionRuntime()) {
          if (!adminUser || (!adminPassword && !adminHash)) {
            console.error("Admin auth misconfigured: missing ADMIN_* env");
            return null;
          }
          if (!safeEqualString(username, adminUser)) return null;

          if (adminHash) {
            const ok = await bcrypt.compare(password, adminHash);
            return ok ? adminIdentity() : null;
          }

          if (
            typeof adminPassword === "string" &&
            adminPassword.length > 0 &&
            safeEqualString(password, adminPassword)
          ) {
            return adminIdentity();
          }

          return null;
        }

        // Local / preview only: env credentials if set
        if (adminUser && username === adminUser) {
          if (adminHash) {
            const ok = await bcrypt.compare(password, adminHash);
            if (ok) return adminIdentity();
          }
          if (
            typeof adminPassword === "string" &&
            adminPassword.length > 0 &&
            password === adminPassword
          ) {
            return adminIdentity();
          }
        }

        // Local demo fallback (never on production)
        if (
          !adminPassword &&
          !adminHash &&
          username === "alex" &&
          password === "alex-demo-2026"
        ) {
          return adminIdentity();
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
