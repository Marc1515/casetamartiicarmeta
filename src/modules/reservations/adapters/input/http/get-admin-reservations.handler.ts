import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { mapReservationHttpError } from "@/modules/reservations/adapters/input/http/map-reservation-http-error";
import { toAdminReservationResponseDtoList } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import { makeGetAdminReservationsUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

export async function handleGetAdminReservations(
    request: NextRequest,
): Promise<NextResponse> {
    try {
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        const getAdminReservationsUseCase = makeGetAdminReservationsUseCase();
        const reservations = await getAdminReservationsUseCase.execute();

        return NextResponse.json(
            toAdminReservationResponseDtoList(reservations),
            { status: 200 },
        );
    } catch (error) {
        return mapReservationHttpError(error);
    }
}