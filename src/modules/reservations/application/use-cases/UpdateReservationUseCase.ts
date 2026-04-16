import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";

export type UpdateReservationUseCaseInput = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
};

export type UpdateReservationUseCaseResult =
    | {
        ok: true;
        reservation: Awaited<
            ReturnType<ReservationRepository["update"]>
        >;
    }
    | {
        ok: false;
        error: "NOT_FOUND";
    }
    | {
        ok: false;
        error: "OVERLAPPING_RESERVATION";
        overlapping: Awaited<
            ReturnType<ReservationRepository["findOverlapping"]>
        >[number];
    };

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
            return {
                ok: false,
                error: "NOT_FOUND",
            };
        }

        const overlappingReservations =
            await this.reservationRepository.findOverlapping(
                input.start,
                input.end,
                input.id,
            );

        const firstOverlappingReservation = overlappingReservations[0];

        if (firstOverlappingReservation) {
            return {
                ok: false,
                error: "OVERLAPPING_RESERVATION",
                overlapping: firstOverlappingReservation,
            };
        }

        const reservation = await this.reservationRepository.update(input.id, {
            title: input.title.trim(),
            start: input.start,
            end: input.end,
            allDay: input.allDay ?? true,
        });

        return {
            ok: true,
            reservation,
        };
    }
}