import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";
import type { AuthUser } from "@/modules/auth/application/models/AuthUser";

export interface AuthUserRepository {
    findByEmail(email: string): Promise<AuthUser | null>;
    updateRole(userId: string, role: AuthRole): Promise<void>;
}