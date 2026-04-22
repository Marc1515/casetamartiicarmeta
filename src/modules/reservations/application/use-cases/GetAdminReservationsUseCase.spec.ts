import { describe, expect, it } from "vitest";
import { GetAdminReservationsUseCase } from "@/modules/reservations/application/use-cases/GetAdminReservationsUseCase";
import { createReservationRepositoryMock } from "@/modules/reservations/test/createReservationRepositoryMock";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("GetAdminReservationsUseCase", () => {
    it("returns all reservations ordered from the repository", async () => {
        const repository = createReservationRepositoryMock();
        const reservations = [
            buildReservation({ id: "reservation-1", title: "Reserva 1" }),
            buildReservation({ id: "reservation-2", title: "Reserva 2" }),
        ];

        repository.findAllOrdered.mockResolvedValue(reservations);

        const useCase = new GetAdminReservationsUseCase(repository);

        const result = await useCase.execute();

        expect(repository.findAllOrdered).toHaveBeenCalledTimes(1);
        expect(result).toEqual(reservations);
    });
});