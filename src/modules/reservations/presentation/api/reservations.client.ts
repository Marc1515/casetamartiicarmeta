import type {
    AdminReservationApiResponse,
    PublicReservationApiResponse,
    ReservationApiError,
} from "@/modules/reservations/contracts/reservation.api";

export type SaveReservationPayload = {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    notes: string | null;
};

export type ReservationClientResult<T> =
    | {
        ok: true;
        data: T;
    }
    | {
        ok: false;
        status: number;
        error: ReservationApiError;
    };

async function parseErrorResponse(
    response: Response,
): Promise<ReservationApiError> {
    const fallbackError: ReservationApiError = {
        error: `Error ${response.status}`,
    };

    try {
        const data = (await response.json()) as ReservationApiError;
        return data;
    } catch {
        return fallbackError;
    }
}

export async function getAdminReservations(): Promise<
    ReservationClientResult<AdminReservationApiResponse[]>
> {
    const response = await fetch("/api/admin/reservations", {
        cache: "no-store",
    });

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            error: await parseErrorResponse(response),
        };
    }

    const data = (await response.json()) as AdminReservationApiResponse[];

    return {
        ok: true,
        data,
    };
}

export async function getPublicReservations(): Promise<
    ReservationClientResult<PublicReservationApiResponse[]>
> {
    const response = await fetch("/api/public/reservations", {
        cache: "no-store",
    });

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            error: await parseErrorResponse(response),
        };
    }

    const data = (await response.json()) as PublicReservationApiResponse[];

    return {
        ok: true,
        data,
    };
}

export async function createReservation(
    payload: SaveReservationPayload,
): Promise<ReservationClientResult<AdminReservationApiResponse>> {
    const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            error: await parseErrorResponse(response),
        };
    }

    const data = (await response.json()) as AdminReservationApiResponse;

    return {
        ok: true,
        data,
    };
}

export async function updateReservation(
    id: string,
    payload: SaveReservationPayload,
): Promise<ReservationClientResult<AdminReservationApiResponse>> {
    const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            error: await parseErrorResponse(response),
        };
    }

    const data = (await response.json()) as AdminReservationApiResponse;

    return {
        ok: true,
        data,
    };
}

export async function deleteReservation(
    id: string,
): Promise<ReservationClientResult<AdminReservationApiResponse>> {
    const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            error: await parseErrorResponse(response),
        };
    }

    const data = (await response.json()) as AdminReservationApiResponse;

    return {
        ok: true,
        data,
    };
}