import type { NextAuthConfig } from "next-auth";

// Config légère sans Prisma adapter — utilisée uniquement par le middleware edge
export const middlewareAuthConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) {
        const callbackUrl = nextUrl.pathname + nextUrl.search;
        return Response.redirect(
          new URL(`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl),
        );
      }
      return true;
    },
  },
};
