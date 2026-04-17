import { NextRequest, NextResponse } from "next/server";
import { toAdminReservationResponseDto } from "@/modules/reservations/adapters/input/http/reservation-response.mapper";
import {
    handleReservationRoute,
    requireAdminOrResponse,
} from "@/modules/reservations/adapters/input/http/reservation-route-handler";
import { createReservationSchema } from "@/modules/reservations/adapters/input/validation/create-reservation.schema";
import { makeCreateReservationUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";

export async function handleCreateReservation(
    request: NextRequest,
): Promise<NextResponse> {
    const adminResult = await requireAdminOrResponse(request);

    if (!adminResult.ok) {
        return adminResult.response;
    }

    return handleReservationRoute(async () => {
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
            return {
                status: 409,
                body: {
                    error:
                        "Las fechas/horas seleccionadas solapan con una reserva existente.",
                    overlapping: toAdminReservationResponseDto(result.overlapping),
                },
            };
        }

        return {
            status: 201,
            body: toAdminReservationResponseDto(result.reservation),
        };
    });
}