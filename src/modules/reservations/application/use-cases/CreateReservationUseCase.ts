import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";

export type CreateReservationUseCaseInput = {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    notes?: string | null;
    createdById?: string | null;
};

export type CreateReservationUseCaseResult =
    | {
        ok: true;
        reservation: Awaited<
            ReturnType<ReservationRepository["create"]>
        >;
    }
    | {
        ok: false;
        error: "OVERLAPPING_RESERVATION";
        overlapping: Awaited<
            ReturnType<ReservationRepository["findOverlapping"]>
        >[number];
    };

export class CreateReservationUseCase {
    constructor(
        private readonly reservationRepository: ReservationRepository,
    ) { }

    async execute(
        input: CreateReservationUseCaseInput,
    ): Promise<CreateReservationUseCaseResult> {
        const overlappingReservations =
            await this.reservationRepository.findOverlapping(
                input.start,
                input.end,
            );

        const firstOverlappingReservation = overlappingReservations[0];

        if (firstOverlappingReservation) {
            return {
                ok: false,
                error: "OVERLAPPING_RESERVATION",
                overlapping: firstOverlappingReservation,
            };
        }

        const reservation = await this.reservationRepository.create({
            title: input.title.trim(),
            start: input.start,
            end: input.end,
            allDay: input.allDay ?? true,
            notes: input.notes ?? null,
            createdById: input.createdById ?? null,
        });

        return {
            ok: true,
            reservation,
        };
    }
}