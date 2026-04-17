import type { Reservation } from "@/modules/reservations/application/models/Reservation";
import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";

export type DeleteReservationUseCaseInput = {
    id: string;
};

export type DeleteReservationUseCaseResult =
    | {
        ok: true;
        reservation: Reservation;
    }
    | {
        ok: false;
        error: "NOT_FOUND";
    };

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
            return {
                ok: false,
                error: "NOT_FOUND",
            };
        }

        const reservation = await this.reservationRepository.delete(input.id);

        return {
            ok: true,
            reservation,
        };
    }
}