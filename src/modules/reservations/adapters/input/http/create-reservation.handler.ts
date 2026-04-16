import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { createReservationSchema } from "@/modules/reservations/adapters/input/validation/create-reservation.schema";
import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";
import { CreateReservationUseCase } from "@/modules/reservations/application/use-cases/CreateReservationUseCase";
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

        const reservationRepository = new PrismaReservationRepository();
        const createReservationUseCase = new CreateReservationUseCase(
            reservationRepository,
        );

        const result = await createReservationUseCase.execute({
            title: validatedBody.title,
            start: validatedBody.start,
            end: validatedBody.end,
            allDay: validatedBody.allDay,
            createdById: adminResult.token.sub ?? null,
        });

        if (!result.ok) {
            return NextResponse.json(
                {
                    error:
                        "Las fechas/horas seleccionadas solapan con una reserva existente.",
                    overlapping: result.overlapping,
                },
                { status: 409 },
            );
        }

        return NextResponse.json(result.reservation, { status: 201 });
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