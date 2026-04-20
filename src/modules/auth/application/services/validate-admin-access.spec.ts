import { describe, expect, it } from "vitest";
import { validateAdminAccess } from "@/modules/auth/application/services/validate-admin-access";

describe("validateAdminAccess", () => {
    it("returns unauthenticated when token is null", () => {
        const result = validateAdminAccess(null);

        expect(result).toEqual({
            ok: false,
            reason: "UNAUTHENTICATED",
        });
    });

    it("returns unauthorized when role is not admin", () => {
        const result = validateAdminAccess({
            sub: "user-1",
            email: "test@example.com",
            role: "VIEWER",
        });

        expect(result).toEqual({
            ok: false,
            reason: "UNAUTHORIZED",
        });
    });

    it("returns success when role is admin", () => {
        const result = validateAdminAccess({
            sub: "admin-1",
            email: "admin@example.com",
            role: "ADMIN",
        });

        expect(result).toEqual({
            ok: true,
            token: {
                sub: "admin-1",
                email: "admin@example.com",
                role: "ADMIN",
            },
        });
    });
});