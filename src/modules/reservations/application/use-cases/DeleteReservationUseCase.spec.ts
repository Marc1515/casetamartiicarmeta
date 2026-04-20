import { describe, expect, it } from "vitest";
import { DeleteReservationUseCase } from "@/modules/reservations/application/use-cases/DeleteReservationUseCase";
import { createReservationRepositoryMock } from "@/modules/reservations/test/createReservationRepositoryMock";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

describe("DeleteReservationUseCase", () => {
    it("returns not found when the reservation does not exist", async () => {
        const repository = createReservationRepositoryMock();

        repository.findById.mockResolvedValue(null);

        const useCase = new DeleteReservationUseCase(repository);

        const result = await useCase.execute({
            id: "missing-id",
        });

        expect(repository.findById).toHaveBeenCalledWith("missing-id");
        expect(repository.delete).not.toHaveBeenCalled();

        expect(result).toEqual({
            ok: false,
            error: "NOT_FOUND",
        });
    });

    it("deletes the reservation when it exists", async () => {
        const repository = createReservationRepositoryMock();
        const existingReservation = buildReservation({ id: "reservation-1" });
        const deletedReservation = buildReservation({ id: "reservation-1" });

        repository.findById.mockResolvedValue(existingReservation);
        repository.delete.mockResolvedValue(deletedReservation);

        const useCase = new DeleteReservationUseCase(repository);

        const result = await useCase.execute({
            id: "reservation-1",
        });

        expect(repository.findById).toHaveBeenCalledWith("reservation-1");
        expect(repository.delete).toHaveBeenCalledWith("reservation-1");

        expect(result).toEqual({
            ok: true,
            reservation: deletedReservation,
        });
    });
});