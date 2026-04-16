import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";

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
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        const { id } = await context.params;
        const body: unknown = await request.json();

        return NextResponse.json(
            {
                message: "Reserva actualizada correctamente",
                id,
                body,
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