import type { PublicReservation } from "@/modules/reservations/application/models/Reservation";
import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";

export type GetPublicReservationsUseCaseResponse = PublicReservation[];

export class GetPublicReservationsUseCase {
    constructor(
        private readonly reservationRepository: ReservationRepository,
    ) { }

    async execute(): Promise<GetPublicReservationsUseCaseResponse> {
        const reservations = await this.reservationRepository.findAllOrdered();

        return reservations.map((reservation) => ({
            id: reservation.id,
            title: reservation.title,
            start: reservation.start,
            end: reservation.end,
            allDay: reservation.allDay,
        }));
    }
}