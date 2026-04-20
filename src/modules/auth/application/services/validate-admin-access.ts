import type { AuthRole } from "@/modules/auth/domain/types/AuthRole";

export type AdminAccessToken = {
    sub?: string;
    email?: string | null;
    role?: AuthRole;
};

export type ValidateAdminAccessResult =
    | {
        ok: true;
        token: AdminAccessToken;
    }
    | {
        ok: false;
        reason: "UNAUTHENTICATED" | "UNAUTHORIZED";
    };

export function validateAdminAccess(
    token: AdminAccessToken | null,
): ValidateAdminAccessResult {
    if (!token) {
        return {
            ok: false,
            reason: "UNAUTHENTICATED",
        };
    }

    if (token.role !== "ADMIN") {
        return {
            ok: false,
            reason: "UNAUTHORIZED",
        };
    }

    return {
        ok: true,
        token,
    };
}