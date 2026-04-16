// src/modules/auth/adapters/output/next-auth/auth.events.ts
import type { NextAuthOptions, User } from "next-auth";
import { prisma } from "@/shared/infrastructure/prisma/prisma";
import { isAdminEmail } from "@/modules/auth/application/services/admin-emails.service";

export const authEvents: NextAuthOptions["events"] = {
    async createUser({ user }: { user: User }) {
        const email = user.email?.toLowerCase();

        if (!isAdminEmail(email)) {
            return;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
        });
    },
};