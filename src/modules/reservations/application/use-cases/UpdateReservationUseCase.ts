import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";
import {
    reservationNotFound,
    reservationOverlapping,
    reservationSuccess,
    type ReservationNotFoundResult,
    type ReservationOverlappingResult,
    type ReservationSuccessResult,
} from "@/modules/reservations/application/results/reservation-use-case.results";

export type UpdateReservationUseCaseInput = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    notes?: string | null;
};

export type UpdateReservationUseCaseResult =
    | ReservationSuccessResult
    | ReservationNotFoundResult
    | ReservationOverlappingResult;

export class UpdateReservationUseCase {
    constructor(
        private readonly reservationRepository: ReservationRepository,
    ) { }

    async execute(
        input: UpdateReservationUseCaseInput,
    ): Promise<UpdateReservationUseCaseResult> {
        const existingReservation = await this.reservationRepository.findById(
            input.id,
        );

        if (!existingReservation) {
            return reservationNotFound();
        }

        const overlappingReservations =
            await this.reservationRepository.findOverlapping(
                input.start,
                input.end,
                input.id,
            );

        const firstOverlappingReservation = overlappingReservations[0];

        if (firstOverlappingReservation) {
            return reservationOverlapping(firstOverlappingReservation);
        }

        const reservation = await this.reservationRepository.update(input.id, {
            title: input.title.trim(),
            start: input.start,
            end: input.end,
            allDay: input.allDay ?? true,
            notes: input.notes ?? null,
        });

        return reservationSuccess(reservation);
    }
}