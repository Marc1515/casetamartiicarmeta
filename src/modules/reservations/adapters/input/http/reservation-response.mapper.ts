// src/modules/reservations/adapters/input/http/reservation-response.mapper.ts
import type {
    ReservationRecord,
} from "@/modules/reservations/application/ports/ReservationRepository";
import type {
    AdminReservationResponseDto,
    PublicReservationResponseDto,
} from "@/modules/reservations/adapters/input/http/reservation-response.dto";

export function toAdminReservationResponseDto(
    reservation: ReservationRecord,
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
    reservations: ReservationRecord[],
): AdminReservationResponseDto[] {
    return reservations.map(toAdminReservationResponseDto);
}

export function toPublicReservationResponseDto(
    reservation: {
        id: string;
        title: string;
        start: Date;
        end: Date;
        allDay: boolean;
    },
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
    reservations: Array<{
        id: string;
        title: string;
        start: Date;
        end: Date;
        allDay: boolean;
    }>,
): PublicReservationResponseDto[] {
    return reservations.map(toPublicReservationResponseDto);
}