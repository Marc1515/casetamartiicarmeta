import type {
    PublicReservation,
    Reservation,
} from "@/modules/reservations/application/models/Reservation";
import type {
    AdminReservationResponseDto,
    PublicReservationResponseDto,
} from "@/modules/reservations/adapters/input/http/reservation-response.dto";

export function toAdminReservationResponseDto(
    reservation: Reservation,
): AdminReservationResponseDto {
    return {
        id: reservation.id,
        title: reservation.title,
        start: reservation.start.toISOString(),
        end: reservation.end.toISOString(),
        allDay: reservation.allDay,
        notes: reservation.notes,
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        createdById: reservation.createdById,
    };
}

export function toAdminReservationResponseDtoList(
    reservations: Reservation[],
): AdminReservationResponseDto[] {
    return reservations.map(toAdminReservationResponseDto);
}

export function toPublicReservationResponseDto(
    reservation: PublicReservation,
): PublicReservationResponseDto {
    return {
        id: reservation.id,
        title: reservation.title,
        start: reservation.start.toISOString(),
        end: reservation.end.toISOString(),
        allDay: reservation.allDay,
    };
}

export function toPublicReservationResponseDtoList(
    reservations: PublicReservation[],
): PublicReservationResponseDto[] {
    return reservations.map(toPublicReservationResponseDto);
}