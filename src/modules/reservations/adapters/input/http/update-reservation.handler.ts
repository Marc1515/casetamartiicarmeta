// src/modules/reservations/adapters/input/http/update-reservation.handler.ts
import { NextRequest, NextResponse } from "next/server";

type UpdateReservationHandlerContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function handleUpdateReservation(
    request: NextRequest,
    context: UpdateReservationHandlerContext,
): Promise<NextResponse> {
    try {
        const { id } = await context.params;

        const body = await request.json();

        return NextResponse.json(
            {
                message: "Reserva actualizada correctamente",
                id,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating reservation:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}