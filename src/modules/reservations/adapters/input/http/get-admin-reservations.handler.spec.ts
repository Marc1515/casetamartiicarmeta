import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { handleGetAdminReservations } from "@/modules/reservations/adapters/input/http/get-admin-reservations.handler";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

const {
    requireAdminOrResponseMock,
    executeMock,
    makeUseCaseMock,
} = vi.hoisted(() => {
    return {
        requireAdminOrResponseMock: vi.fn(),
        executeMock: vi.fn(),
        makeUseCaseMock: vi.fn(),
    };
});

vi.mock(
    "@/modules/reservations/adapters/input/http/reservation-route-handler",
    async () => {
        const actual =
            await vi.importActual<
                typeof import("@/modules/reservations/adapters/input/http/reservation-route-handler")
            >("@/modules/reservations/adapters/input/http/reservation-route-handler");

        return {
            ...actual,
            requireAdminOrResponse: requireAdminOrResponseMock,
        };
    },
);

vi.mock("@/modules/reservations/infrastructure/reservations.dependencies", () => {
    return {
        makeGetAdminReservationsUseCase: makeUseCaseMock,
    };
});

describe("handleGetAdminReservations", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        makeUseCaseMock.mockReturnValue({
            execute: executeMock,
        });
    });

    it("returns 401 when not authenticated", async () => {
        const response401 = NextResponse.json(
            { error: "No autenticado" },
            { status: 401 },
        );

        requireAdminOrResponseMock.mockResolvedValue({
            ok: false,
            response: response401,
        });

        const response = await handleGetAdminReservations({} as never);
        expect(response.status).toBe(401);
    });

    it("returns reservations when success", async () => {
        const reservations = [
            buildReservation({ id: "1" }),
            buildReservation({ id: "2" }),
        ];

        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: { sub: "admin-1", role: "ADMIN" },
        });

        executeMock.mockResolvedValue({
            ok: true,
            reservations,
        });

        const response = await handleGetAdminReservations({} as never);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.length).toBe(2);
        expect(body[0].id).toBe("1");
    });
});