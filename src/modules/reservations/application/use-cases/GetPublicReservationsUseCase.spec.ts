import { describe, expect, it } from "vitest";
import { GetPublicReservationsUseCase } from "@/modules/reservations/application/use-cases/GetPublicReservationsUseCase";
import { createReservationRepositoryMock } from "@/modules/reservations/test/createReservationRepositoryMock";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("GetPublicReservationsUseCase", () => {
    it("returns only the public fields of each reservation", async () => {
        const repository = createReservationRepositoryMock();
        const reservations = [
            buildReservation({
                id: "reservation-1",
                title: "Reserva 1",
                notes: "Notas privadas",
                createdById: "admin-1",
            }),
            buildReservation({
                id: "reservation-2",
                title: "Reserva 2",
                notes: "Más notas privadas",
                createdById: "admin-2",
            }),
        ];

        repository.findAllOrdered.mockResolvedValue(reservations);

        const useCase = new GetPublicReservationsUseCase(repository);

        const result = await useCase.execute();

        expect(repository.findAllOrdered).toHaveBeenCalledTimes(1);
        expect(result).toEqual([
            {
                id: "reservation-1",
                title: "Reserva 1",
                start: reservations[0].start,
                end: reservations[0].end,
                allDay: reservations[0].allDay,
            },
            {
                id: "reservation-2",
                title: "Reserva 2",
                start: reservations[1].start,
                end: reservations[1].end,
                allDay: reservations[1].allDay,
            },
        ]);
    });
});