import bcrypt from "bcryptjs";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { type Role } from "../../../generated/prisma";
import { db } from "~/server/db";

/**
 * Module augmentation pour `next-auth`. Ajoute `id` et `role` sur l'objet session.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Configuration Auth.js v5 — Credentials + JWT.
 *
 * Note : PrismaAdapter@2.7.2 ne supporte pas le mapping de modèle (userModel).
 * L'adapter est omis pour Story 1.3 ; les sessions sont stockées en JWT.
 * Migration vers database sessions différée à Story 1.3-v2 si besoin.
 */
export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.utilisateur.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? "",
          role: (token.role as Role) ?? "AGENT",
        },
      };
    },
  },
} satisfies NextAuthConfig;
