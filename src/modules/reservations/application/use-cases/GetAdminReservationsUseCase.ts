// src/modules/reservations/application/use-cases/GetAdminReservationsUseCase.ts
import {
    PrismaReservationRepository,
    type ReservationRecord,
} from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";

export type GetAdminReservationsUseCaseResponse = ReservationRecord[];

export class GetAdminReservationsUseCase {
    constructor(
        private readonly reservationRepository: PrismaReservationRepository,
    ) { }

    async execute(): Promise<GetAdminReservationsUseCaseResponse> {
        const reservations = await this.reservationRepository.findAllOrdered();

        return reservations;
    }
}