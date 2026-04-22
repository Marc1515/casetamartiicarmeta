import { NextRequest, NextResponse } from "next/server";
import { mapReservationUseCaseResultToHttp } from "@/modules/reservations/adapters/input/http/reservation-use-case-to-http.mapper";
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

        return mapReservationUseCaseResultToHttp(result);
    });
}