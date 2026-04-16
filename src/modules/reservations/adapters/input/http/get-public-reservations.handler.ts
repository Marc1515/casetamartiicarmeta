import { NextRequest, NextResponse } from "next/server";
import { mapReservationHttpError } from "@/modules/reservations/adapters/input/http/map-reservation-http-error";
import { makeGetPublicReservationsUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

export async function handleGetPublicReservations(
    _request: NextRequest,
): Promise<NextResponse> {
    try {
        const getPublicReservationsUseCase = makeGetPublicReservationsUseCase();
        const reservations = await getPublicReservationsUseCase.execute();

        return NextResponse.json(reservations, { status: 200 });
    } catch (error) {
        return mapReservationHttpError(error);
    }
}