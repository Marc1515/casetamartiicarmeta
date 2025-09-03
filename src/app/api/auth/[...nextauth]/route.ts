import NextAuth, {
  type NextAuthOptions,
  type User,
  type Session,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";

const admins = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const PUBLIC_REDIRECT = "/";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Se ejecuta cuando el adapter ha creado el usuario por primera vez
  events: {
    async createUser({ user }: { user: User }) {
      const email = user.email?.toLowerCase();
      if (email && admins.includes(email)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },

  callbacks: {
    // 1) Bloquea logins no permitidos y redirige a la pública
    async signIn({ user }: { user: User }): Promise<boolean | string> {
      const email = user.email?.toLowerCase();
      if (!email) return PUBLIC_REDIRECT; // -> "/"
      return admins.includes(email) || PUBLIC_REDIRECT; // -> "/"
    },
    // dentro de callbacks.jwt
    async jwt({ token, user }) {
      const email = (user?.email || token.email)?.toLowerCase();
      if (email && admins.includes(email)) {
        token.role = "ADMIN";
        const userId = (user?.id ?? token.sub) as string | undefined;
        if (userId) {
          await prisma.user
            .update({ where: { id: userId }, data: { role: "ADMIN" } })
            .catch(() => {});
        }
        return token;
      }

      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    // 3) Expone id/role en la sesión
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        // gracias a la augmentación de tipos ya no usamos 'any'
        session.user.id = (token.sub as string | undefined) ?? session.user.id;
        session.user.role =
          (token.role as "ADMIN" | "VIEWER" | undefined) ?? "VIEWER";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
