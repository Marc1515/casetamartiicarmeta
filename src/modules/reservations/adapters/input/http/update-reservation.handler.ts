import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { mapReservationHttpError } from "@/modules/reservations/adapters/input/http/map-reservation-http-error";
import { toAdminReservationResponseDto } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import { updateReservationSchema } from "@/modules/reservations/adapters/input/validation/update-reservation.schema";
import { makeUpdateReservationUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

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

        const updateReservationUseCase = makeUpdateReservationUseCase();

        const result = await updateReservationUseCase.execute({
            id,
            title: validatedBody.title,
            start: validatedBody.start,
            end: validatedBody.end,
            allDay: validatedBody.allDay,
            notes: validatedBody.notes,
        });

        if (!result.ok) {
            if (result.error === "NOT_FOUND") {
                return NextResponse.json(
                    { error: "Reserva no encontrada" },
                    { status: 404 },
                );
            }

            return NextResponse.json(
                {
                    error:
                        "Las fechas/horas seleccionadas solapan con una reserva existente.",
                    overlapping: toAdminReservationResponseDto(result.overlapping),
                },
                { status: 409 },
            );
        }

        return NextResponse.json(
            toAdminReservationResponseDto(result.reservation),
            { status: 200 },
        );
    } catch (error) {
        return mapReservationHttpError(error);
    }
}