import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { handleCreateReservation } from "@/modules/reservations/adapters/input/http/create-reservation.handler";
import { buildReservation } from "@/modules/reservations/test/buildReservation";
import { createJsonRequest } from "@/modules/reservations/test/createJsonRequest";

const {
    requireAdminOrResponseMock,
    executeCreateReservationMock,
    makeCreateReservationUseCaseMock,
} = vi.hoisted(() => {
    return {
        requireAdminOrResponseMock: vi.fn(),
        executeCreateReservationMock: vi.fn(),
        makeCreateReservationUseCaseMock: vi.fn(),
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
        makeCreateReservationUseCase: makeCreateReservationUseCaseMock,
    };
});

describe("handleCreateReservation", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        makeCreateReservationUseCaseMock.mockReturnValue({
            execute: executeCreateReservationMock,
        });
    });

    it("returns the unauthorized response when admin access fails", async () => {
        const unauthorizedResponse = NextResponse.json(
            { error: "No autenticado" },
            { status: 401 },
        );

        requireAdminOrResponseMock.mockResolvedValue({
            ok: false,
            response: unauthorizedResponse,
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations",
            "POST",
            {
                title: "Reserva",
                start: "2026-06-10T10:00:00.000Z",
                end: "2026-06-10T12:00:00.000Z",
                allDay: false,
                notes: "Notas",
            },
        );

        const response = await handleCreateReservation(request as never);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({ error: "No autenticado" });
        expect(makeCreateReservationUseCaseMock).not.toHaveBeenCalled();
        expect(executeCreateReservationMock).not.toHaveBeenCalled();
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
            "http://localhost:3000/api/admin/reservations",
            "POST",
            {
                title: "",
                start: "2026-06-10T12:00:00.000Z",
                end: "2026-06-10T10:00:00.000Z",
            },
        );

        const response = await handleCreateReservation(request as never);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe("Datos inválidos");
        expect(body.details).toBeDefined();
        expect(makeCreateReservationUseCaseMock).not.toHaveBeenCalled();
        expect(executeCreateReservationMock).not.toHaveBeenCalled();
    });

    it("returns 201 when the reservation is created successfully", async () => {
        const createdReservation = buildReservation({
            id: "reservation-created",
            title: "Reserva creada",
            notes: "Notas creadas",
            createdById: "admin-1",
        });

        requireAdminOrResponseMock.mockResolvedValue({
            ok: true,
            token: {
                sub: "admin-1",
                role: "ADMIN",
            },
        });

        executeCreateReservationMock.mockResolvedValue({
            ok: true,
            reservation: createdReservation,
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations",
            "POST",
            {
                title: "Reserva creada",
                start: "2026-06-10T10:00:00.000Z",
                end: "2026-06-10T12:00:00.000Z",
                allDay: false,
                notes: "Notas creadas",
            },
        );

        const response = await handleCreateReservation(request as never);
        const body = await response.json();

        expect(makeCreateReservationUseCaseMock).toHaveBeenCalledTimes(1);
        expect(executeCreateReservationMock).toHaveBeenCalledWith({
            title: "Reserva creada",
            start: new Date("2026-06-10T10:00:00.000Z"),
            end: new Date("2026-06-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas creadas",
            createdById: "admin-1",
        });

        expect(response.status).toBe(201);
        expect(body).toEqual({
            id: "reservation-created",
            title: "Reserva creada",
            start: createdReservation.start.toISOString(),
            end: createdReservation.end.toISOString(),
            allDay: false,
            notes: "Notas creadas",
            createdAt: createdReservation.createdAt.toISOString(),
            updatedAt: createdReservation.updatedAt.toISOString(),
            createdById: "admin-1",
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

        executeCreateReservationMock.mockResolvedValue({
            ok: false,
            error: "OVERLAPPING_RESERVATION",
            overlapping: overlappingReservation,
        });

        const request = createJsonRequest(
            "http://localhost:3000/api/admin/reservations",
            "POST",
            {
                title: "Nueva reserva",
                start: "2026-06-10T10:00:00.000Z",
                end: "2026-06-10T12:00:00.000Z",
                allDay: false,
                notes: "Notas",
            },
        );

        const response = await handleCreateReservation(request as never);
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