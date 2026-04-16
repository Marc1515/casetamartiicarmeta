import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";
import { GetAdminReservationsUseCase } from "@/modules/reservations/application/use-cases/GetAdminReservationsUseCase";

export async function handleGetAdminReservations(
    request: NextRequest,
): Promise<NextResponse> {
    try {
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        const reservationRepository = new PrismaReservationRepository();
        const getAdminReservationsUseCase = new GetAdminReservationsUseCase(
            reservationRepository,
        );

        const reservations = await getAdminReservationsUseCase.execute();

        return NextResponse.json(reservations, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin reservations:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}