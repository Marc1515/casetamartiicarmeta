import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

export default withAuth(() => {}, {
  callbacks: {
    authorized: ({ token, req }: { token: JWT | null; req: NextRequest }) => {
      const isAdminCalendar =
        req.nextUrl.pathname.startsWith("/admin/calendario");
      if (!isAdminCalendar) return true; // /admin es público
      return !!token && token.role === "ADMIN"; // solo ADMIN ve el calendario
    },
  },
});

export const config = {
  matcher: ["/admin/calendario/:path*", "/api/admin/:path*"],
};
