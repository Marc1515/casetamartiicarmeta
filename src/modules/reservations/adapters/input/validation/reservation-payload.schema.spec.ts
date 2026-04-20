import { describe, expect, it } from "vitest";
import { reservationPayloadSchema } from "@/modules/reservations/adapters/input/validation/reservation-payload.schema";

describe("reservationPayloadSchema", () => {
    it("parses a valid payload", () => {
        const result = reservationPayloadSchema.parse({
            title: "Reserva válida",
            start: "2026-08-10T10:00:00.000Z",
            end: "2026-08-10T12:00:00.000Z",
            allDay: false,
            notes: "Notas válidas",
        });

        expect(result).toEqual({
            title: "Reserva válida",
            start: new Date("2026-08-10T10:00:00.000Z"),
            end: new Date("2026-08-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas válidas",
        });
    });

    it("uses default allDay=true when not provided", () => {
        const result = reservationPayloadSchema.parse({
            title: "Reserva sin allDay",
            start: "2026-08-10T10:00:00.000Z",
            end: "2026-08-10T12:00:00.000Z",
        });

        expect(result.allDay).toBe(true);
    });

    it("transforms empty notes into null", () => {
        const result = reservationPayloadSchema.parse({
            title: "Reserva sin notas",
            start: "2026-08-10T10:00:00.000Z",
            end: "2026-08-10T12:00:00.000Z",
            notes: "",
        });

        expect(result.notes).toBeNull();
    });

    it("fails when title is empty", () => {
        const result = reservationPayloadSchema.safeParse({
            title: "",
            start: "2026-08-10T10:00:00.000Z",
            end: "2026-08-10T12:00:00.000Z",
        });

        expect(result.success).toBe(false);

        if (result.success) {
            throw new Error("Expected validation to fail");
        }

        expect(result.error.flatten().fieldErrors.title).toContain(
            "El título es obligatorio",
        );
    });

    it("fails when end is not after start", () => {
        const result = reservationPayloadSchema.safeParse({
            title: "Reserva inválida",
            start: "2026-08-10T12:00:00.000Z",
            end: "2026-08-10T10:00:00.000Z",
        });

        expect(result.success).toBe(false);

        if (result.success) {
            throw new Error("Expected validation to fail");
        }

        expect(result.error.flatten().fieldErrors.end).toContain(
            "La fecha de fin debe ser posterior a la de inicio",
        );
    });

    it("fails when start date is invalid", () => {
        const result = reservationPayloadSchema.safeParse({
            title: "Reserva inválida",
            start: "fecha-invalida",
            end: "2026-08-10T12:00:00.000Z",
        });

        expect(result.success).toBe(false);

        if (result.success) {
            throw new Error("Expected validation to fail");
        }

        expect(result.error.flatten().fieldErrors.start).toContain(
            "La fecha de inicio no es válida",
        );
    });
});