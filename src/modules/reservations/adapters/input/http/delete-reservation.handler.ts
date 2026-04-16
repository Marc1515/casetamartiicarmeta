import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";
import { DeleteReservationUseCase } from "@/modules/reservations/application/use-cases/DeleteReservationUseCase";

type DeleteReservationHandlerContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function handleDeleteReservation(
    request: NextRequest,
    context: DeleteReservationHandlerContext,
): Promise<NextResponse> {
    try {
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        const { id } = await context.params;

        const reservationRepository = new PrismaReservationRepository();
        const deleteReservationUseCase = new DeleteReservationUseCase(
            reservationRepository,
        );

        const result = await deleteReservationUseCase.execute({ id });

        if (!result.ok) {
            return NextResponse.json(
                { error: "Reserva no encontrada" },
                { status: 404 },
            );
        }

        return NextResponse.json(result.reservation, { status: 200 });
    } catch (error) {
        console.error("Error deleting reservation:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}