import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isAuthPath = (pathname: string) =>
  pathname.startsWith("/admin/calendario") || pathname.startsWith("/api/admin");

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token: JWT | null } }) {
    const pathname = req.nextUrl.pathname;
    if (isAuthPath(pathname)) {
      return NextResponse.next();
    }
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }: { token: JWT | null; req: NextRequest }) => {
        if (!isAuthPath(req.nextUrl.pathname)) return true;
        return !!token && token.role === "ADMIN";
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|admin|login|_next|_vercel|.*\\..*).*)",
    "/admin/calendario/:path*",
    "/api/admin/:path*",
  ],
};
