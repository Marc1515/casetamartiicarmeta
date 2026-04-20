import { describe, expect, it } from "vitest";
import { CreateReservationUseCase } from "@/modules/reservations/application/use-cases/CreateReservationUseCase";
import { createReservationRepositoryMock } from "@/modules/reservations/test/createReservationRepositoryMock";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("CreateReservationUseCase", () => {
    it("returns overlapping error when another reservation already exists in the range", async () => {
        const repository = createReservationRepositoryMock();
        const overlappingReservation = buildReservation({ id: "overlap-1" });

        repository.findOverlapping.mockResolvedValue([overlappingReservation]);

        const useCase = new CreateReservationUseCase(repository);

        const result = await useCase.execute({
            title: "Nueva reserva",
            start: new Date("2026-02-10T10:00:00.000Z"),
            end: new Date("2026-02-10T12:00:00.000Z"),
            allDay: false,
            notes: "Notas",
            createdById: "user-1",
        });

        expect(repository.findOverlapping).toHaveBeenCalledWith(
            new Date("2026-02-10T10:00:00.000Z"),
            new Date("2026-02-10T12:00:00.000Z"),
        );
        expect(repository.create).not.toHaveBeenCalled();

        expect(result).toEqual({
            ok: false,
            error: "OVERLAPPING_RESERVATION",
            overlapping: overlappingReservation,
        });
    });

    it("creates the reservation when there are no overlaps", async () => {
        const repository = createReservationRepositoryMock();
        const createdReservation = buildReservation({
            id: "created-1",
            title: "Reserva final",
            notes: "Notas finales",
            createdById: "admin-1",
        });

        repository.findOverlapping.mockResolvedValue([]);
        repository.create.mockResolvedValue(createdReservation);

        const useCase = new CreateReservationUseCase(repository);

        const result = await useCase.execute({
            title: "   Reserva final   ",
            start: new Date("2026-03-01T09:00:00.000Z"),
            end: new Date("2026-03-01T11:00:00.000Z"),
            allDay: false,
            notes: "Notas finales",
            createdById: "admin-1",
        });

        expect(repository.create).toHaveBeenCalledWith({
            title: "Reserva final",
            start: new Date("2026-03-01T09:00:00.000Z"),
            end: new Date("2026-03-01T11:00:00.000Z"),
            allDay: false,
            notes: "Notas finales",
            createdById: "admin-1",
        });

        expect(result).toEqual({
            ok: true,
            reservation: createdReservation,
        });
    });

    it("uses default values for allDay, notes and createdById when they are not provided", async () => {
        const repository = createReservationRepositoryMock();
        const createdReservation = buildReservation({
            id: "created-2",
            allDay: true,
            notes: null,
            createdById: null,
        });

        repository.findOverlapping.mockResolvedValue([]);
        repository.create.mockResolvedValue(createdReservation);

        const useCase = new CreateReservationUseCase(repository);

        const result = await useCase.execute({
            title: "Reserva sin opcionales",
            start: new Date("2026-04-05T08:00:00.000Z"),
            end: new Date("2026-04-05T10:00:00.000Z"),
        });

        expect(repository.create).toHaveBeenCalledWith({
            title: "Reserva sin opcionales",
            start: new Date("2026-04-05T08:00:00.000Z"),
            end: new Date("2026-04-05T10:00:00.000Z"),
            allDay: true,
            notes: null,
            createdById: null,
        });

        expect(result).toEqual({
            ok: true,
            reservation: createdReservation,
        });
    });
});