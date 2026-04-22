import type {
    AdminReservationApiResponse,
    PublicReservationApiResponse,
} from "@/modules/reservations/contracts/reservation.api";
import type {
    AdminReservationCalendarEvent,
    ReservationCalendarEvent,
} from "@/modules/reservations/presentation/models/reservation-calendar.model";

export function toAdminReservationCalendarEvent(
    reservation: AdminReservationApiResponse,
): AdminReservationCalendarEvent {
    return {
        id: reservation.id,
        title: reservation.title,
        start: new Date(reservation.start),
        end: new Date(reservation.end),
        allDay: reservation.allDay ?? false,
        notes: reservation.notes ?? null,
    };
}

export function toAdminReservationCalendarEventList(
    reservations: AdminReservationApiResponse[],
): AdminReservationCalendarEvent[] {
    return reservations.map(toAdminReservationCalendarEvent);
}

export function toPublicReservationCalendarEvent(
    reservation: PublicReservationApiResponse,
): ReservationCalendarEvent {
    return {
        id: reservation.id,
        title: reservation.title,
        start: new Date(reservation.start),
        end: new Date(reservation.end),
        allDay: reservation.allDay ?? true,
    };
}

export function toPublicReservationCalendarEventList(
    reservations: PublicReservationApiResponse[],
): ReservationCalendarEvent[] {
    return reservations.map(toPublicReservationCalendarEvent);
}