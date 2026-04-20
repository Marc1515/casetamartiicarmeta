import { describe, expect, it } from "vitest";
import {
    toAdminReservationResponseDto,
    toAdminReservationResponseDtoList,
    toPublicReservationResponseDto,
    toPublicReservationResponseDtoList,
} from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("reservation-response.mapper", () => {
    it("maps a reservation to admin response dto", () => {
        const reservation = buildReservation({
            id: "reservation-1",
            title: "Reserva admin",
            notes: "Notas privadas",
            createdById: "admin-1",
        });

        const result = toAdminReservationResponseDto(reservation);

        expect(result).toEqual({
            id: "reservation-1",
            title: "Reserva admin",
            start: reservation.start.toISOString(),
            end: reservation.end.toISOString(),
            allDay: reservation.allDay,
            notes: "Notas privadas",
            createdAt: reservation.createdAt.toISOString(),
            updatedAt: reservation.updatedAt.toISOString(),
            createdById: "admin-1",
        });
    });

    it("maps a reservation list to admin response dto list", () => {
        const reservations = [
            buildReservation({ id: "reservation-1", title: "Reserva 1" }),
            buildReservation({ id: "reservation-2", title: "Reserva 2" }),
        ];

        const result = toAdminReservationResponseDtoList(reservations);

        expect(result).toEqual([
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: reservations[0].start.toISOString(),
                end: reservations[0].end.toISOString(),
                allDay: reservations[0].allDay,
                notes: reservations[0].notes,
                createdAt: reservations[0].createdAt.toISOString(),
                updatedAt: reservations[0].updatedAt.toISOString(),
                createdById: reservations[0].createdById,
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: reservations[1].start.toISOString(),
                end: reservations[1].end.toISOString(),
                allDay: reservations[1].allDay,
                notes: reservations[1].notes,
                createdAt: reservations[1].createdAt.toISOString(),
                updatedAt: reservations[1].updatedAt.toISOString(),
                createdById: reservations[1].createdById,
            },
        ]);
    });

    it("maps a reservation to public response dto without private fields", () => {
        const reservation = buildReservation({
            id: "reservation-public-1",
            title: "Reserva pública",
            notes: "No debe salir",
            createdById: "admin-1",
        });

        const result = toPublicReservationResponseDto({
            id: reservation.id,
            title: reservation.title,
            start: reservation.start,
            end: reservation.end,
            allDay: reservation.allDay,
        });

        expect(result).toEqual({
            id: "reservation-public-1",
            title: "Reserva pública",
            start: reservation.start.toISOString(),
            end: reservation.end.toISOString(),
            allDay: reservation.allDay,
        });
    });

    it("maps a reservation list to public response dto list", () => {
        const reservations = [
            buildReservation({ id: "reservation-1", title: "Reserva 1" }),
            buildReservation({ id: "reservation-2", title: "Reserva 2" }),
        ];

        const result = toPublicReservationResponseDtoList([
            {
                id: reservations[0].id,
                title: reservations[0].title,
                start: reservations[0].start,
                end: reservations[0].end,
                allDay: reservations[0].allDay,
            },
            {
                id: reservations[1].id,
                title: reservations[1].title,
                start: reservations[1].start,
                end: reservations[1].end,
                allDay: reservations[1].allDay,
            },
        ]);

        expect(result).toEqual([
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: reservations[0].start.toISOString(),
                end: reservations[0].end.toISOString(),
                allDay: reservations[0].allDay,
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: reservations[1].start.toISOString(),
                end: reservations[1].end.toISOString(),
                allDay: reservations[1].allDay,
            },
        ]);
    });
});