import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { createReservationSchema } from "@/modules/reservations/adapters/input/validation/create-reservation.schema";
import { ZodError } from "zod";

export async function handleCreateReservation(
    request: NextRequest,
): Promise<NextResponse> {
    try {
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        const body: unknown = await request.json();
        const validatedBody = createReservationSchema.parse(body);

        return NextResponse.json(
            {
                message: "Reserva creada correctamente",
                data: validatedBody,
            },
            { status: 201 },
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

        console.error("Error creating reservation:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}