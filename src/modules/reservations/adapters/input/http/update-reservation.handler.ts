import { NextRequest, NextResponse } from "next/server";
import {
    handleReservationRoute,
    requireAdminOrResponse,
} from "@/modules/reservations/adapters/input/http/reservation-route-handler";
import { updateReservationSchema } from "@/modules/reservations/adapters/input/validation/update-reservation.schema";
import { makeUpdateReservationUseCase } from "@/modules/reservations/infrastructure/reservations.dependencies";
import { mapReservationUseCaseResultToHttp } from "@/modules/reservations/adapters/input/http/reservation-use-case-to-http.mapper";

type UpdateReservationHandlerContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function handleUpdateReservation(
    request: NextRequest,
    context: UpdateReservationHandlerContext,
): Promise<NextResponse> {
    const adminResult = await requireAdminOrResponse(request);

    if (!adminResult.ok) {
        return adminResult.response;
    }

    return handleReservationRoute(async () => {
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

        return mapReservationUseCaseResultToHttp(result);
    });
}