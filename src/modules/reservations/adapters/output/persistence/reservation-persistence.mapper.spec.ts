import { describe, expect, it } from "vitest";
import {
    toReservationPersistenceModel,
    toReservationPersistenceModelList,
} from "@/modules/reservations/adapters/output/persistence/reservation-persistence.mapper";

describe("reservation-persistence.mapper", () => {
    it("maps a prisma event to reservation model", () => {
        const event = {
            id: "event-1",
            title: "Reserva persistida",
            start: new Date("2026-09-10T10:00:00.000Z"),
            end: new Date("2026-09-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas persistidas",
            createdAt: new Date("2026-09-01T08:00:00.000Z"),
            updatedAt: new Date("2026-09-01T09:00:00.000Z"),
            createdById: "admin-1",
        };

        const result = toReservationPersistenceModel(event);

        expect(result).toEqual({
            id: "event-1",
            title: "Reserva persistida",
            start: new Date("2026-09-10T10:00:00.000Z"),
            end: new Date("2026-09-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas persistidas",
            createdAt: new Date("2026-09-01T08:00:00.000Z"),
            updatedAt: new Date("2026-09-01T09:00:00.000Z"),
            createdById: "admin-1",
        });
    });

    it("maps a prisma event list to reservation model list", () => {
        const events = [
            {
                id: "event-1",
                title: "Reserva 1",
                start: new Date("2026-09-10T10:00:00.000Z"),
                end: new Date("2026-09-10T12:00:00.000Z"),
                allDay: false,
                notes: null,
                createdAt: new Date("2026-09-01T08:00:00.000Z"),
                updatedAt: new Date("2026-09-01T09:00:00.000Z"),
                createdById: null,
            },
            {
                id: "event-2",
                title: "Reserva 2",
                start: new Date("2026-09-11T10:00:00.000Z"),
                end: new Date("2026-09-11T12:00:00.000Z"),
                allDay: true,
                notes: "Notas",
                createdAt: new Date("2026-09-02T08:00:00.000Z"),
                updatedAt: new Date("2026-09-02T09:00:00.000Z"),
                createdById: "admin-2",
            },
        ];

        const result = toReservationPersistenceModelList(events);

        expect(result).toEqual(events);
    });
});