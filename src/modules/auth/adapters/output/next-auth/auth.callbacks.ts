// src/modules/auth/adapters/output/next-auth/auth.callbacks.ts
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { prisma } from "@/shared/infrastructure/prisma/prisma";
import { isAdminEmail } from "@/modules/auth/application/services/admin-emails.service";
import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";

type AppToken = JWT & {
    role?: AuthRole;
};

export const authCallbacks: NextAuthOptions["callbacks"] = {
    async signIn({ user }: { user: User }): Promise<boolean> {
        return isAdminEmail(user.email);
    },

    async jwt({ token, user }): Promise<AppToken> {
        const appToken = token as AppToken;
        const email = (user?.email || appToken.email)?.toLowerCase();

        if (email && isAdminEmail(email)) {
            appToken.role = "ADMIN";

            const userId = user?.id ?? appToken.sub;
            if (userId) {
                await prisma.user
                    .update({
                        where: { id: userId },
                        data: { role: "ADMIN" },
                    })
                    .catch(() => undefined);
            }

            return appToken;
        }

        if (email) {
            const dbUser = await prisma.user.findUnique({
                where: { email },
                select: { id: true, role: true },
            });

            if (dbUser) {
                appToken.sub = dbUser.id;
                appToken.role = dbUser.role as AuthRole;
            }
        }

        return appToken;
    },

    async session({
        session,
        token,
    }: {
        session: Session;
        token: JWT;
    }): Promise<Session> {
        const appToken = token as AppToken;

        if (session.user) {
            session.user.id =
                (appToken.sub as string | undefined) ?? session.user.id;

            session.user.role = appToken.role ?? "VIEWER";
        }

        return session;
    },
};