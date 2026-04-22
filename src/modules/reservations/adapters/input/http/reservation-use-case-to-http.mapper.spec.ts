import { describe, expect, it } from "vitest";
import { mapReservationUseCaseResultToHttp } from "@/modules/reservations/adapters/input/http/reservation-use-case-to-http.mapper";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("mapReservationUseCaseResultToHttp", () => {
    it("maps success result with default 200 status", () => {
        const reservation = buildReservation({
            id: "reservation-1",
            title: "Reserva 1",
            notes: "Notas privadas",
            createdById: "admin-1",
        });

        const result = mapReservationUseCaseResultToHttp({
            ok: true,
            reservation,
        });

        expect(result).toEqual({
            status: 200,
            body: {
                id: "reservation-1",
                title: "Reserva 1",
                start: reservation.start.toISOString(),
                end: reservation.end.toISOString(),
                allDay: reservation.allDay,
                notes: "Notas privadas",
                createdAt: reservation.createdAt.toISOString(),
                updatedAt: reservation.updatedAt.toISOString(),
                createdById: "admin-1",
            },
        });
    });

    it("maps success result with custom success status", () => {
        const reservation = buildReservation({
            id: "reservation-2",
            title: "Reserva creada",
        });

        const result = mapReservationUseCaseResultToHttp(
            {
                ok: true,
                reservation,
            },
            {
                successStatus: 201,
            },
        );

        expect(result.status).toBe(201);
        expect(result.body).toEqual({
            id: "reservation-2",
            title: "Reserva creada",
            start: reservation.start.toISOString(),
            end: reservation.end.toISOString(),
            allDay: reservation.allDay,
            notes: reservation.notes,
            createdAt: reservation.createdAt.toISOString(),
            updatedAt: reservation.updatedAt.toISOString(),
            createdById: reservation.createdById,
        });
    });

    it("maps not found result to 404", () => {
        const result = mapReservationUseCaseResultToHttp({
            ok: false,
            error: "NOT_FOUND",
        });

        expect(result).toEqual({
            status: 404,
            body: {
                error: "Reserva no encontrada",
            },
        });
    });

    it("maps overlapping result to 409", () => {
        const overlappingReservation = buildReservation({
            id: "overlap-1",
            title: "Reserva existente",
            notes: "Ya ocupada",
            createdById: "admin-2",
        });

        const result = mapReservationUseCaseResultToHttp({
            ok: false,
            error: "OVERLAPPING_RESERVATION",
            overlapping: overlappingReservation,
        });

        expect(result).toEqual({
            status: 409,
            body: {
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
            },
        });
    });
});