import { describe, expect, it } from "vitest";
import {
    buildBusyDaySet,
    getPublicReservationDayProps,
} from "@/modules/reservations/presentation/calendar/reservation-public-calendar.utils";

describe("reservation-public-calendar.utils", () => {
    it("builds a busy day set from calendar events", () => {
        const result = buildBusyDaySet([
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: new Date(2026, 10, 10, 0, 0, 0, 0),
                end: new Date(2026, 10, 12, 0, 0, 0, 0),
                allDay: false,
            },
        ]);

        expect(result.has("2026-11-10")).toBe(true);
        expect(result.has("2026-11-11")).toBe(true);
        expect(result.has("2026-11-12")).toBe(false);
        expect(result.size).toBe(2);
    });

    it("returns busy day props when date is reserved", () => {
        const busyDays = new Set<string>(["2026-11-10"]);

        const result = getPublicReservationDayProps(
            new Date("2026-11-10T12:00:00.000Z"),
            busyDays,
            "Reservado",
        );

        expect(result).toEqual({
            className: "is-busy-day",
            style: {
                "--reserved-label": "\"Reservado\"",
            },
        });
    });

    it("returns empty props when date is not reserved", () => {
        const busyDays = new Set<string>(["2026-11-10"]);

        const result = getPublicReservationDayProps(
            new Date("2026-11-11T12:00:00.000Z"),
            busyDays,
            "Reservado",
        );

        expect(result).toEqual({});
    });
});