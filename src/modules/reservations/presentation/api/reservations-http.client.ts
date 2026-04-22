import type { ReservationApiError } from "@/modules/reservations/contracts/reservation.api";

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

async function parseReservationErrorResponse(
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

export async function executeReservationRequest<T>(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<ReservationClientResult<T>> {
    const response = await fetch(input, init);

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            error: await parseReservationErrorResponse(response),
        };
    }

    const data = (await response.json()) as T;

    return {
        ok: true,
        data,
    };
}