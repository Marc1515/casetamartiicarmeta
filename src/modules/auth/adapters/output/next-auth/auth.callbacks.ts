import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";
import { isAdminEmail } from "@/modules/auth/application/services/admin-emails.service";
import { makeResolveAuthUserRoleUseCase } from "@/modules/auth/infrastructure/auth.dependencies";

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
        const userId = user?.id ?? appToken.sub ?? undefined;

        const resolveAuthUserRoleUseCase = makeResolveAuthUserRoleUseCase();

        const result = await resolveAuthUserRoleUseCase.execute({
            email,
            userId,
        });

        appToken.sub = result.userId ?? appToken.sub;
        appToken.role = result.role;

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