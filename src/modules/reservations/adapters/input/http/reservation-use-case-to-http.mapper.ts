import type { ReservationHttpHandlerResult } from "@/modules/reservations/adapters/input/http/reservation-route-handler";
import {
    type ReservationNotFoundResult,
    type ReservationOverlappingResult,
    type ReservationSuccessResult,
} from "@/modules/reservations/application/results/reservation-use-case.results";
import { toAdminReservationResponseDto } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";

type ReservationUseCaseResult =
    | ReservationSuccessResult
    | ReservationNotFoundResult
    | ReservationOverlappingResult;

export function mapReservationUseCaseResultToHttp(
    result: ReservationUseCaseResult,
    options?: {
        successStatus?: number;
    },
): ReservationHttpHandlerResult {
    if (result.ok) {
        return {
            status: options?.successStatus ?? 200,
            body: toAdminReservationResponseDto(result.reservation),
        };
    }

    if (result.error === "NOT_FOUND") {
        return {
            status: 404,
            body: { error: "Reserva no encontrada" },
        };
    }

    if (result.error === "OVERLAPPING_RESERVATION") {
        return {
            status: 409,
            body: {
                error:
                    "Las fechas/horas seleccionadas solapan con una reserva existente.",
                overlapping: toAdminReservationResponseDto(result.overlapping),
            },
        };
    }

    return {
        status: 500,
        body: { error: "Error desconocido" },
    };
}