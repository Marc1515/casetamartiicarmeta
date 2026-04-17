import type { Reservation } from "@/modules/reservations/application/models/Reservation";
import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";

export type GetAdminReservationsUseCaseResponse = Reservation[];

export class GetAdminReservationsUseCase {
    constructor(
        private readonly reservationRepository: ReservationRepository,
    ) { }

    async execute(): Promise<GetAdminReservationsUseCaseResponse> {
        const reservations = await this.reservationRepository.findAllOrdered();

        return reservations;
    }
}