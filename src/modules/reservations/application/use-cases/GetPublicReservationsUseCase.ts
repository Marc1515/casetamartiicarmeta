// src/modules/reservations/application/use-cases/GetPublicReservationsUseCase.ts
import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";

export type PublicReservationDto = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
};

export type GetPublicReservationsUseCaseResponse = PublicReservationDto[];

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