import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";
import {
    reservationNotFound,
    reservationSuccess,
    type ReservationNotFoundResult,
    type ReservationSuccessResult,
} from "@/modules/reservations/application/results/reservation-use-case.results";

export type DeleteReservationUseCaseInput = {
    id: string;
};

export type DeleteReservationUseCaseResult =
    | ReservationSuccessResult
    | ReservationNotFoundResult;

export class DeleteReservationUseCase {
    constructor(
        private readonly reservationRepository: ReservationRepository,
    ) { }

    async execute(
        input: DeleteReservationUseCaseInput,
    ): Promise<DeleteReservationUseCaseResult> {
        const existingReservation = await this.reservationRepository.findById(
            input.id,
        );

        if (!existingReservation) {
            return reservationNotFound();
        }

        const reservation = await this.reservationRepository.delete(input.id);

        return reservationSuccess(reservation);
    }
}