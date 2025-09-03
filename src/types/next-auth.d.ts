import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      role?: "ADMIN" | "VIEWER";
    };
  }
  interface User {
    id: string;
    role?: "ADMIN" | "VIEWER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "VIEWER";
  }
}
