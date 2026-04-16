// src/modules/reservations/adapters/input/http/delete-reservation.handler.ts
import { NextRequest, NextResponse } from "next/server";

type DeleteReservationHandlerContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function handleDeleteReservation(
    _request: NextRequest,
    context: DeleteReservationHandlerContext,
): Promise<NextResponse> {
    try {
        const { id } = await context.params;

        return NextResponse.json(
            {
                message: "Reserva eliminada correctamente",
                id,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error deleting reservation:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}