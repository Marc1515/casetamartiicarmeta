import type {
    AdminReservationApiResponse,
    PublicReservationApiResponse,
} from "@/modules/reservations/contracts/reservation.api";
import {
    executeReservationRequest,
    type ReservationClientResult,
} from "@/modules/reservations/presentation/api/reservations-http.client";

export type SaveReservationPayload = {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    notes: string | null;
};

export async function getAdminReservations(): Promise<
    ReservationClientResult<AdminReservationApiResponse[]>
> {
    return executeReservationRequest<AdminReservationApiResponse[]>(
        "/api/admin/reservations",
        {
            cache: "no-store",
        },
    );
}

export async function getPublicReservations(): Promise<
    ReservationClientResult<PublicReservationApiResponse[]>
> {
    return executeReservationRequest<PublicReservationApiResponse[]>(
        "/api/public/reservations",
        {
            cache: "no-store",
        },
    );
}

export async function createReservation(
    payload: SaveReservationPayload,
): Promise<ReservationClientResult<AdminReservationApiResponse>> {
    return executeReservationRequest<AdminReservationApiResponse>(
        "/api/admin/reservations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );
}

export async function updateReservation(
    id: string,
    payload: SaveReservationPayload,
): Promise<ReservationClientResult<AdminReservationApiResponse>> {
    return executeReservationRequest<AdminReservationApiResponse>(
        `/api/admin/reservations/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );
}

export async function deleteReservation(
    id: string,
): Promise<ReservationClientResult<AdminReservationApiResponse>> {
    return executeReservationRequest<AdminReservationApiResponse>(
        `/api/admin/reservations/${id}`,
        {
            method: "DELETE",
        },
    );
}