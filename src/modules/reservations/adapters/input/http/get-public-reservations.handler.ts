import { NextResponse } from "next/server";
import { toPublicReservationResponseDtoList } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import { handleReservationRoute } from "@/modules/reservations/adapters/input/http/reservation-route-handler";
import { makeGetPublicReservationsUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

export async function handleGetPublicReservations(): Promise<NextResponse> {
    return handleReservationRoute(async () => {
        const getPublicReservationsUseCase = makeGetPublicReservationsUseCase();
        const reservations = await getPublicReservationsUseCase.execute();

        return {
            status: 200,
            body: toPublicReservationResponseDtoList(reservations),
        };
    });
}