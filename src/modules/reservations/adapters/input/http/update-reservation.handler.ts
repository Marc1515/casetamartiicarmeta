import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { updateReservationSchema } from "@/modules/reservations/adapters/input/validation/update-reservation.schema";
import { ZodError } from "zod";

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
        const validatedBody = updateReservationSchema.parse(body);

        return NextResponse.json(
            {
                message: "Reserva actualizada correctamente",
                id,
                data: validatedBody,
            },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: error.flatten(),
                },
                { status: 400 },
            );
        }

        console.error("Error updating reservation:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}