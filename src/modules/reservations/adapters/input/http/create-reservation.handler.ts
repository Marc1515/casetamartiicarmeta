import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";
import { mapReservationHttpError } from "@/modules/reservations/adapters/input/http/map-reservation-http-error";
import { toAdminReservationResponseDto } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import { createReservationSchema } from "@/modules/reservations/adapters/input/validation/create-reservation.schema";
import { makeCreateReservationUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

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

        const createReservationUseCase = makeCreateReservationUseCase();

        const result = await createReservationUseCase.execute({
            title: validatedBody.title,
            start: validatedBody.start,
            end: validatedBody.end,
            allDay: validatedBody.allDay,
            notes: validatedBody.notes,
            createdById: adminResult.token.sub ?? null,
        });

        if (!result.ok) {
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
            { status: 201 },
        );
    } catch (error) {
        return mapReservationHttpError(error);
    }
}