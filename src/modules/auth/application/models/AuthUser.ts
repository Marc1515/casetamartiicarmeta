import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";

export type AuthUser = {
    id: string;
    email: string;
    role: AuthRole;
};