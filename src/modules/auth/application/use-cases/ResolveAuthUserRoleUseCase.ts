import { isAdminEmail } from "@/modules/auth/application/services/admin-emails.service";
import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";
import type { AuthUserRepository } from "@/modules/auth/application/ports/AuthUserRepository";

export type ResolveAuthUserRoleInput = {
    email?: string | null;
    userId?: string | null;
};

export type ResolveAuthUserRoleResult = {
    userId?: string;
    role: AuthRole;
};

export class ResolveAuthUserRoleUseCase {
    constructor(private readonly authUserRepository: AuthUserRepository) { }

    async execute(
        input: ResolveAuthUserRoleInput,
    ): Promise<ResolveAuthUserRoleResult> {
        const normalizedEmail = input.email?.toLowerCase();

        if (!normalizedEmail) {
            return {
                userId: input.userId ?? undefined,
                role: "VIEWER",
            };
        }

        if (isAdminEmail(normalizedEmail)) {
            if (input.userId) {
                await this.authUserRepository.updateRole(input.userId, "ADMIN");
            }

            return {
                userId: input.userId ?? undefined,
                role: "ADMIN",
            };
        }

        const dbUser = await this.authUserRepository.findByEmail(normalizedEmail);

        if (!dbUser) {
            return {
                userId: input.userId ?? undefined,
                role: "VIEWER",
            };
        }

        return {
            userId: dbUser.id,
            role: dbUser.role,
        };
    }
}