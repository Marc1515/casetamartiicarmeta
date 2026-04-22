import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { handleUpdateReservation } from "@/modules/reservations/adapters/input/http/update-reservation.handler";
import { buildReservation } from "@/modules/reservations/test/buildReservation";
import { createJsonRequest } from "@/modules/reservations/test/createJsonRequest";

const {
    requireAdminOrResponseMock,
    executeUpdateReservationMock,
    makeUpdateReservationUseCaseMock,
} = vi.hoisted(() => {
    return {
        requireAdminOrResponseMock: vi.fn(),
        executeUpdateReservationMock: vi.fn(),
        makeUpdateReservationUseCaseMock: vi.fn(),
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
        makeUpdateReservationUseCase: makeUpdateReservationUseCaseMock,
    };
});

describe("handleUpdateReservation", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        makeUpdateReservationUseCaseMock.mockReturnValue({
            execute: executeUpdateReservationMock,
        });
    });

    it("returns the forbidden response when admin access fails", async () => {
        const forbiddenResponse = NextResponse.json(
            { error: "No autorizado" },
            { status: 403 },
        );

        requireAdminOrResponseMock.mockResolvedValue({
            ok: false,
            response: forbiddenResponse,
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations/reservation-1",
            "PATCH",
            {
                title: "Reserva",
                start: "2026-06-10T10:00:00.000Z",
                end: "2026-06-10T12:00:00.000Z",
                allDay: false,
                notes: "Notas",
            },
        );

        const response = await handleUpdateReservation(request as never, {
            params: Promise.resolve({ id: "reservation-1" }),
        });
        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body).toEqual({ error: "No autorizado" });
        expect(makeUpdateReservationUseCaseMock).not.toHaveBeenCalled();
        expect(executeUpdateReservationMock).not.toHaveBeenCalled();
    });

    it("returns 400 when the payload is invalid", async () => {
        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: {
                sub: "admin-1",
                role: "ADMIN",
            },
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations/reservation-1",
            "PATCH",
            {
                title: "",
                start: "2026-06-10T12:00:00.000Z",
                end: "2026-06-10T10:00:00.000Z",
            },
        );

        const response = await handleUpdateReservation(request as never, {
            params: Promise.resolve({ id: "reservation-1" }),
        });
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe("Datos inválidos");
        expect(body.details).toBeDefined();
        expect(makeUpdateReservationUseCaseMock).not.toHaveBeenCalled();
        expect(executeUpdateReservationMock).not.toHaveBeenCalled();
    });

    it("returns 200 when the reservation is updated successfully", async () => {
        const updatedReservation = buildReservation({
            id: "reservation-1",
            title: "Reserva actualizada",
            notes: "Notas actualizadas",
            createdById: "admin-1",
        });

        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: {
                sub: "admin-1",
                role: "ADMIN",
            },
        });

        executeUpdateReservationMock.mockResolvedValue({
            ok: true,
            reservation: updatedReservation,
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations/reservation-1",
            "PATCH",
            {
                title: "Reserva actualizada",
                start: "2026-07-01T10:00:00.000Z",
                end: "2026-07-01T12:00:00.000Z",
                allDay: false,
                notes: "Notas actualizadas",
            },
        );

        const response = await handleUpdateReservation(request as never, {
            params: Promise.resolve({ id: "reservation-1" }),
        });
        const body = await response.json();

        expect(makeUpdateReservationUseCaseMock).toHaveBeenCalledTimes(1);
        expect(executeUpdateReservationMock).toHaveBeenCalledWith({
            id: "reservation-1",
            title: "Reserva actualizada",
            start: new Date("2026-07-01T10:00:00.000Z"),
            end: new Date("2026-07-01T12:00:00.000Z"),
            allDay: false,
            notes: "Notas actualizadas",
        });

        expect(response.status).toBe(200);
        expect(body).toEqual({
            id: "reservation-1",
            title: "Reserva actualizada",
            start: updatedReservation.start.toISOString(),
            end: updatedReservation.end.toISOString(),
            allDay: updatedReservation.allDay,
            notes: "Notas actualizadas",
            createdAt: updatedReservation.createdAt.toISOString(),
            updatedAt: updatedReservation.updatedAt.toISOString(),
            createdById: "admin-1",
        });
    });

    it("returns 404 when the reservation does not exist", async () => {
        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: {
                sub: "admin-1",
                role: "ADMIN",
            },
        });

        executeUpdateReservationMock.mockResolvedValue({
            ok: false,
            error: "NOT_FOUND",
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations/reservation-missing",
            "PATCH",
            {
                title: "Reserva actualizada",
                start: "2026-07-01T10:00:00.000Z",
                end: "2026-07-01T12:00:00.000Z",
                allDay: false,
                notes: "Notas actualizadas",
            },
        );

        const response = await handleUpdateReservation(request as never, {
            params: Promise.resolve({ id: "reservation-missing" }),
        });
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({
            error: "Reserva no encontrada",
        });
    });

    it("returns 409 when the reservation overlaps with an existing one", async () => {
        const overlappingReservation = buildReservation({
            id: "overlap-1",
            title: "Reserva existente",
            notes: "Ya ocupada",
            createdById: "admin-2",
        });

        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: {
                sub: "admin-1",
                role: "ADMIN",
            },
        });

        executeUpdateReservationMock.mockResolvedValue({
            ok: false,
            error: "OVERLAPPING_RESERVATION",
            overlapping: overlappingReservation,
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations/reservation-1",
            "PATCH",
            {
                title: "Reserva actualizada",
                start: "2026-07-01T10:00:00.000Z",
                end: "2026-07-01T12:00:00.000Z",
                allDay: false,
                notes: "Notas actualizadas",
            },
        );

        const response = await handleUpdateReservation(request as never, {
            params: Promise.resolve({ id: "reservation-1" }),
        });
        const body = await response.json();

        expect(response.status).toBe(409);
        expect(body).toEqual({
            error:
                "Las fechas/horas seleccionadas solapan con una reserva existente.",
            overlapping: {
                id: "overlap-1",
                title: "Reserva existente",
                start: overlappingReservation.start.toISOString(),
                end: overlappingReservation.end.toISOString(),
                allDay: overlappingReservation.allDay,
                notes: "Ya ocupada",
                createdAt: overlappingReservation.createdAt.toISOString(),
                updatedAt: overlappingReservation.updatedAt.toISOString(),
                createdById: "admin-2",
            },
        });
    });
});