import NextAuth from "next-auth";
import { middlewareAuthConfig } from "~/server/auth/middleware-config";

// Middleware edge-compatible (sans Prisma adapter)
// Story 1.3 remplacera middlewareAuthConfig avec la logique d'autorisation réelle
export const { auth: middleware } = NextAuth(middlewareAuthConfig);
export const config = {
  matcher: ["/((?!connexion|api|_next/static|_next/image|favicon.ico).*)"],
};
