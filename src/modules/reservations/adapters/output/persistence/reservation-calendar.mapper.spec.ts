import { describe, expect, it } from "vitest";
import {
    toAdminReservationCalendarEvent,
    toAdminReservationCalendarEventList,
    toPublicReservationCalendarEvent,
    toPublicReservationCalendarEventList,
} from "@/modules/reservations/presentation/mappers/reservation-calendar.mapper";

describe("reservation-calendar.mapper", () => {
    it("maps admin reservation api response to calendar event", () => {
        const reservation = {
            id: "reservation-1",
            title: "Reserva admin",
            start: "2026-10-10T10:00:00.000Z",
            end: "2026-10-10T12:00:00.000Z",
            allDay: false,
            notes: "Notas admin",
            createdAt: "2026-10-01T08:00:00.000Z",
            updatedAt: "2026-10-01T09:00:00.000Z",
            createdById: "admin-1",
        };

        const result = toAdminReservationCalendarEvent(reservation);

        expect(result).toEqual({
            id: "reservation-1",
            title: "Reserva admin",
            start: new Date("2026-10-10T10:00:00.000Z"),
            end: new Date("2026-10-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas admin",
        });
    });

    it("maps admin reservation api response list to calendar event list", () => {
        const reservations = [
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: "2026-10-10T10:00:00.000Z",
                end: "2026-10-10T12:00:00.000Z",
                allDay: false,
                notes: "Notas 1",
                createdAt: "2026-10-01T08:00:00.000Z",
                updatedAt: "2026-10-01T09:00:00.000Z",
                createdById: "admin-1",
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: "2026-10-11T10:00:00.000Z",
                end: "2026-10-11T12:00:00.000Z",
                allDay: true,
                notes: null,
                createdAt: "2026-10-02T08:00:00.000Z",
                updatedAt: "2026-10-02T09:00:00.000Z",
                createdById: null,
            },
        ];

        const result = toAdminReservationCalendarEventList(reservations);

        expect(result).toEqual([
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: new Date("2026-10-10T10:00:00.000Z"),
                end: new Date("2026-10-10T12:00:00.000Z"),
                allDay: false,
                notes: "Notas 1",
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: new Date("2026-10-11T10:00:00.000Z"),
                end: new Date("2026-10-11T12:00:00.000Z"),
                allDay: true,
                notes: null,
            },
        ]);
    });

    it("maps public reservation api response to calendar event", () => {
        const reservation = {
            id: "reservation-public-1",
            title: "Reserva pública",
            start: "2026-10-12T10:00:00.000Z",
            end: "2026-10-12T12:00:00.000Z",
            allDay: false,
        };

        const result = toPublicReservationCalendarEvent(reservation);

        expect(result).toEqual({
            id: "reservation-public-1",
            title: "Reserva pública",
            start: new Date("2026-10-12T10:00:00.000Z"),
            end: new Date("2026-10-12T12:00:00.000Z"),
            allDay: false,
        });
    });

    it("maps public reservation api response list to calendar event list", () => {
        const reservations = [
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: "2026-10-14T10:00:00.000Z",
                end: "2026-10-14T12:00:00.000Z",
                allDay: false,
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: "2026-10-15T10:00:00.000Z",
                end: "2026-10-15T12:00:00.000Z",
                allDay: true,
            },
        ];

        const result = toPublicReservationCalendarEventList(reservations);

        expect(result).toEqual([
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: new Date("2026-10-14T10:00:00.000Z"),
                end: new Date("2026-10-14T12:00:00.000Z"),
                allDay: false,
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: new Date("2026-10-15T10:00:00.000Z"),
                end: new Date("2026-10-15T12:00:00.000Z"),
                allDay: true,
            },
        ]);
    });
});