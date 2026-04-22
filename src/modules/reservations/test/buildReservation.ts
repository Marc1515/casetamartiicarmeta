import type { Reservation } from "@/modules/reservations/application/models/Reservation";

type BuildReservationOverrides = Partial<Reservation>;

const DEFAULT_DATE = new Date("2026-01-10T10:00:00.000Z");
const DEFAULT_END_DATE = new Date("2026-01-10T12:00:00.000Z");
const DEFAULT_CREATED_AT = new Date("2026-01-01T09:00:00.000Z");
const DEFAULT_UPDATED_AT = new Date("2026-01-01T09:00:00.000Z");

export function buildReservation(
    overrides: BuildReservationOverrides = {},
): Reservation {
    return {
        id: "reservation-1",
        title: "Reserva test",
        start: DEFAULT_DATE,
        end: DEFAULT_END_DATE,
        allDay: false,
        notes: null,
        createdAt: DEFAULT_CREATED_AT,
        updatedAt: DEFAULT_UPDATED_AT,
        createdById: null,
        ...overrides,
    };
}