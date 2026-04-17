import { NextRequest, NextResponse } from "next/server";
import { toAdminReservationResponseDto } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import {
    handleReservationRoute,
    requireAdminOrResponse,
} from "@/modules/reservations/adapters/input/http/reservation-route-handler";
import { makeDeleteReservationUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

type DeleteReservationHandlerContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function handleDeleteReservation(
    request: NextRequest,
    context: DeleteReservationHandlerContext,
): Promise<NextResponse> {
    const adminResult = await requireAdminOrResponse(request);

    if (!adminResult.ok) {
        return adminResult.response;
    }

    return handleReservationRoute(async () => {
        const { id } = await context.params;
        const deleteReservationUseCase = makeDeleteReservationUseCase();
        const result = await deleteReservationUseCase.execute({ id });

        if (!result.ok) {
            return {
                status: 404,
                body: { error: "Reserva no encontrada" },
            };
        }

        return {
            status: 200,
            body: toAdminReservationResponseDto(result.reservation),
        };
    });
}