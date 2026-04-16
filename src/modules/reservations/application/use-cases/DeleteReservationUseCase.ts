import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";

export type DeleteReservationUseCaseInput = {
    id: string;
};

export type DeleteReservationUseCaseResult =
    | {
        ok: true;
        reservation: Awaited<
            ReturnType<PrismaReservationRepository["delete"]>
        >;
    }
    | {
        ok: false;
        error: "NOT_FOUND";
    };

export class DeleteReservationUseCase {
    constructor(
        private readonly reservationRepository: PrismaReservationRepository,
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