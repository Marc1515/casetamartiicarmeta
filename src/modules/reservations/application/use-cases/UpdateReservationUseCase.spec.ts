import { describe, expect, it } from "vitest";
import { UpdateReservationUseCase } from "@/modules/reservations/application/use-cases/UpdateReservationUseCase";
import { createReservationRepositoryMock } from "@/modules/reservations/test/createReservationRepositoryMock";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("UpdateReservationUseCase", () => {
    it("returns not found when the reservation does not exist", async () => {
        const repository = createReservationRepositoryMock();

        repository.findById.mockResolvedValue(null);

        const useCase = new UpdateReservationUseCase(repository);

        const result = await useCase.execute({
            id: "missing-id",
            title: "Reserva actualizada",
            start: new Date("2026-02-10T10:00:00.000Z"),
            end: new Date("2026-02-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas",
        });

        expect(repository.findById).toHaveBeenCalledWith("missing-id");
        expect(repository.findOverlapping).not.toHaveBeenCalled();
        expect(repository.update).not.toHaveBeenCalled();

        expect(result).toEqual({
            ok: false,
            error: "NOT_FOUND",
        });
    });

    it("returns overlapping error when another reservation already exists in the range", async () => {
        const repository = createReservationRepositoryMock();
        const existingReservation = buildReservation({ id: "reservation-1" });
        const overlappingReservation = buildReservation({ id: "reservation-2" });

        repository.findById.mockResolvedValue(existingReservation);
        repository.findOverlapping.mockResolvedValue([overlappingReservation]);

        const useCase = new UpdateReservationUseCase(repository);

        const result = await useCase.execute({
            id: "reservation-1",
            title: "Reserva actualizada",
            start: new Date("2026-03-10T10:00:00.000Z"),
            end: new Date("2026-03-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas actualizadas",
        });

        expect(repository.findById).toHaveBeenCalledWith("reservation-1");
        expect(repository.findOverlapping).toHaveBeenCalledWith(
            new Date("2026-03-10T10:00:00.000Z"),
            new Date("2026-03-10T12:00:00.000Z"),
            "reservation-1",
        );
        expect(repository.update).not.toHaveBeenCalled();

        expect(result).toEqual({
            ok: false,
            error: "OVERLAPPING_RESERVATION",
            overlapping: overlappingReservation,
        });
    });

    it("updates the reservation when it exists and there are no overlaps", async () => {
        const repository = createReservationRepositoryMock();
        const existingReservation = buildReservation({ id: "reservation-1" });
        const updatedReservation = buildReservation({
            id: "reservation-1",
            title: "Reserva editada",
            notes: "Notas editadas",
            allDay: false,
        });

        repository.findById.mockResolvedValue(existingReservation);
        repository.findOverlapping.mockResolvedValue([]);
        repository.update.mockResolvedValue(updatedReservation);

        const useCase = new UpdateReservationUseCase(repository);

        const result = await useCase.execute({
            id: "reservation-1",
            title: "   Reserva editada   ",
            start: new Date("2026-04-12T09:00:00.000Z"),
            end: new Date("2026-04-12T11:00:00.000Z"),
            allDay: false,
            notes: "Notas editadas",
        });

        expect(repository.update).toHaveBeenCalledWith("reservation-1", {
            title: "Reserva editada",
            start: new Date("2026-04-12T09:00:00.000Z"),
            end: new Date("2026-04-12T11:00:00.000Z"),
            allDay: false,
            notes: "Notas editadas",
        });

        expect(result).toEqual({
            ok: true,
            reservation: updatedReservation,
        });
    });

    it("uses default values for allDay and notes when they are not provided", async () => {
        const repository = createReservationRepositoryMock();
        const existingReservation = buildReservation({ id: "reservation-1" });
        const updatedReservation = buildReservation({
            id: "reservation-1",
            allDay: true,
            notes: null,
        });

        repository.findById.mockResolvedValue(existingReservation);
        repository.findOverlapping.mockResolvedValue([]);
        repository.update.mockResolvedValue(updatedReservation);

        const useCase = new UpdateReservationUseCase(repository);

        const result = await useCase.execute({
            id: "reservation-1",
            title: "Reserva sin opcionales",
            start: new Date("2026-05-01T08:00:00.000Z"),
            end: new Date("2026-05-01T10:00:00.000Z"),
        });

        expect(repository.update).toHaveBeenCalledWith("reservation-1", {
            title: "Reserva sin opcionales",
            start: new Date("2026-05-01T08:00:00.000Z"),
            end: new Date("2026-05-01T10:00:00.000Z"),
            allDay: true,
            notes: null,
        });

        expect(result).toEqual({
            ok: true,
            reservation: updatedReservation,
        });
    });
});