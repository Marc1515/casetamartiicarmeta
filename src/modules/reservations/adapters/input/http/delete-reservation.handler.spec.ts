import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { handleDeleteReservation } from "@/modules/reservations/adapters/input/http/delete-reservation.handler";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

const {
    requireAdminOrResponseMock,
    executeDeleteReservationMock,
    makeDeleteReservationUseCaseMock,
} = vi.hoisted(() => {
    return {
        requireAdminOrResponseMock: vi.fn(),
        executeDeleteReservationMock: vi.fn(),
        makeDeleteReservationUseCaseMock: vi.fn(),
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
        makeDeleteReservationUseCase: makeDeleteReservationUseCaseMock,
    };
});

describe("handleDeleteReservation", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        makeDeleteReservationUseCaseMock.mockReturnValue({
            execute: executeDeleteReservationMock,
        });
    });

    it("returns 401 when user is not authenticated", async () => {
        const response401 = NextResponse.json(
            { error: "No autenticado" },
            { status: 401 },
        );

        requireAdminOrResponseMock.mockResolvedValue({
            ok: false,
            response: response401,
        });

        const response = await handleDeleteReservation({} as never, {
            params: Promise.resolve({ id: "1" }),
        });

        expect(response.status).toBe(401);
    });

    it("returns 404 when reservation does not exist", async () => {
        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: { sub: "admin-1", role: "ADMIN" },
        });

        executeDeleteReservationMock.mockResolvedValue({
            ok: false,
            error: "NOT_FOUND",
        });

        const response = await handleDeleteReservation({} as never, {
            params: Promise.resolve({ id: "missing" }),
        });

        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({ error: "Reserva no encontrada" });
    });

    it("returns 200 when reservation is deleted", async () => {
        const deleted = buildReservation({ id: "1" });

        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: { sub: "admin-1", role: "ADMIN" },
        });

        executeDeleteReservationMock.mockResolvedValue({
            ok: true,
            reservation: deleted,
        });

        const response = await handleDeleteReservation({} as never, {
            params: Promise.resolve({ id: "1" }),
        });

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.id).toBe("1");
    });
});