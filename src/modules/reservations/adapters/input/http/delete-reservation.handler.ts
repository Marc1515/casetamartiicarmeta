import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";

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