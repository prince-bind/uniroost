import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Re-issue the JWT periodically so role/verification changes made by an
    // admin (e.g. verifying an owner) propagate without requiring re-login.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid email or password");
        }

        // Brute-force protection: cap login attempts per email, independent
        // of IP, so an attacker can't spread guesses across proxies.
        const ip = getClientIp(req?.headers as any);
        const limitResult = rateLimit(`login:${parsed.data.email}:${ip}`, 8, 60 * 1000);
        if (!limitResult.success) {
          throw new Error("Too many login attempts. Please try again shortly.");
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as any).role;
        token.isVerified = (user as any).isVerified;
        token.userId = (user as any).id;
      }

      // Refresh verification/role status from the DB periodically so an
      // admin approving an owner doesn't require that owner to log out
      // and back in to see the change. `session.update()` on the client
      // also triggers this via `trigger === "update"`.
      if (trigger === "update" && token.userId) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.userId as string },
          select: { role: true, isVerified: true },
        });
        if (fresh) {
          token.role = fresh.role;
          token.isVerified = fresh.isVerified;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
