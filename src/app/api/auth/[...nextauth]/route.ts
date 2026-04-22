import NextAuth from "next-auth";
import { authOptions } from "@/modules/auth/adapters/output/next-auth/auth.config";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
