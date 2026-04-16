import { NextRequest, NextResponse } from "next/server";
import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";
import { GetPublicReservationsUseCase } from "@/modules/reservations/application/use-cases/GetPublicReservationsUseCase";

export async function handleGetPublicReservations(
    _request: NextRequest,
): Promise<NextResponse> {
    try {
        const reservationRepository = new PrismaReservationRepository();
        const getPublicReservationsUseCase = new GetPublicReservationsUseCase(
            reservationRepository,
        );

        const reservations = await getPublicReservationsUseCase.execute();

        return NextResponse.json(reservations, { status: 200 });
    } catch (error) {
        console.error("Error fetching public reservations:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}