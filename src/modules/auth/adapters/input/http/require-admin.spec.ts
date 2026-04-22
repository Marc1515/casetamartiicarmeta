import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAdminFromRequest } from "@/modules/auth/adapters/input/http/require-admin";

const { getTokenMock } = vi.hoisted(() => {
    return {
        getTokenMock: vi.fn(),
    };
});

vi.mock("next-auth/jwt", () => {
    return {
        getToken: getTokenMock,
    };
});

describe("requireAdminFromRequest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when token is missing", async () => {
        getTokenMock.mockResolvedValue(null);

        const request = new Request("http://localhost:3000/api/admin/reservations");

        const result = await requireAdminFromRequest(request as never);

        expect(result.ok).toBe(false);

        if (result.ok) {
            throw new Error("Expected unauthorized result");
        }

        expect(result.response.status).toBe(401);
        expect(await result.response.json()).toEqual({
            error: "No autenticado",
        });
    });

    it("returns 403 when token role is not admin", async () => {
        getTokenMock.mockResolvedValue({
            sub: "user-1",
            email: "user@test.com",
            role: "VIEWER",
        });

        const request = new Request("http://localhost:3000/api/admin/reservations");

        const result = await requireAdminFromRequest(request as never);

        expect(result.ok).toBe(false);

        if (result.ok) {
            throw new Error("Expected forbidden result");
        }

        expect(result.response.status).toBe(403);
        expect(await result.response.json()).toEqual({
            error: "No autorizado",
        });
    });

    it("returns success when token role is admin", async () => {
        getTokenMock.mockResolvedValue({
            sub: "admin-1",
            email: "admin@test.com",
            role: "ADMIN",
        });

        const request = new Request("http://localhost:3000/api/admin/reservations");

        const result = await requireAdminFromRequest(request as never);

        expect(result).toEqual({
            ok: true,
            token: {
                sub: "admin-1",
                email: "admin@test.com",
                role: "ADMIN",
            },
        });
    });
});