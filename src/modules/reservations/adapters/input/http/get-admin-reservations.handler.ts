import { NextRequest, NextResponse } from "next/server";
import { toAdminReservationResponseDtoList } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import {
    handleReservationRoute,
    requireAdminOrResponse,
} from "@/modules/reservations/adapters/input/http/reservation-route-handler";
import { makeGetAdminReservationsUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

export async function handleGetAdminReservations(
    request: NextRequest,
): Promise<NextResponse> {
    const adminResult = await requireAdminOrResponse(request);

    if (!adminResult.ok) {
        return adminResult.response;
    }

    return handleReservationRoute(async () => {
        const getAdminReservationsUseCase = makeGetAdminReservationsUseCase();
        const reservations = await getAdminReservationsUseCase.execute();

        return {
            status: 200,
            body: toAdminReservationResponseDtoList(reservations),
        };
    });
}