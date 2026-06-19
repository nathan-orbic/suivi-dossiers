import type { NextAuthConfig } from "next-auth";

// Config légère sans Prisma adapter — utilisée uniquement par le middleware edge
// Story 1.3 ajoutera la logique d'autorisation réelle (authorized callback)
export const middlewareAuthConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    authorized: () => true,
  },
};
