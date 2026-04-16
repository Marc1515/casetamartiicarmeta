import type {
    ReservationRecord,
    ReservationRepository,
} from "@/modules/reservations/application/ports/ReservationRepository";

export type GetAdminReservationsUseCaseResponse = ReservationRecord[];

export class GetAdminReservationsUseCase {
    constructor(
        private readonly reservationRepository: ReservationRepository,
    ) { }

    async execute(): Promise<GetAdminReservationsUseCaseResponse> {
        const reservations = await this.reservationRepository.findAllOrdered();

        return reservations;
    }
}