import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { mapReservationHttpError } from "@/modules/reservations/adapters/input/http/map-reservation-http-error";
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
    try {
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        const { id } = await context.params;
        const deleteReservationUseCase = makeDeleteReservationUseCase();
        const result = await deleteReservationUseCase.execute({ id });

        if (!result.ok) {
            return NextResponse.json(
                { error: "Reserva no encontrada" },
                { status: 404 },
            );
        }

        return NextResponse.json(result.reservation, { status: 200 });
    } catch (error) {
        return mapReservationHttpError(error);
    }
}