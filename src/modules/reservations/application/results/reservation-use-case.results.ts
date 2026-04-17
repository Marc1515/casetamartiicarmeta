import type { Reservation } from "@/modules/reservations/application/models/Reservation";

export type ReservationSuccessResult = {
    ok: true;
    reservation: Reservation;
};

export type ReservationNotFoundResult = {
    ok: false;
    error: "NOT_FOUND";
};

export type ReservationOverlappingResult = {
    ok: false;
    error: "OVERLAPPING_RESERVATION";
    overlapping: Reservation;
};

export function reservationSuccess(
    reservation: Reservation,
): ReservationSuccessResult {
    return {
        ok: true,
        reservation,
    };
}

export function reservationNotFound(): ReservationNotFoundResult {
    return {
        ok: false,
        error: "NOT_FOUND",
    };
}

export function reservationOverlapping(
    overlapping: Reservation,
): ReservationOverlappingResult {
    return {
        ok: false,
        error: "OVERLAPPING_RESERVATION",
        overlapping,
    };
}