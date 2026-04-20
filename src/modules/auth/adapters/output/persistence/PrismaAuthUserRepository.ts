import type { AuthUserRepository } from "@/modules/auth/application/ports/AuthUserRepository";
import type { AuthUser } from "@/modules/auth/application/models/AuthUser";
import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";
import { prisma } from "@/shared/infrastructure/prisma/prisma";

export class PrismaAuthUserRepository implements AuthUserRepository {
    async findByEmail(email: string): Promise<AuthUser | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!user || !user.email) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role as AuthRole,
        };
    }

    async updateRole(userId: string, role: AuthRole): Promise<void> {
        await prisma.user
            .update({
                where: { id: userId },
                data: { role },
            })
            .catch(() => undefined);
    }
}