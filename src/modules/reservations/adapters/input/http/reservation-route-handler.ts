import { NextRequest, NextResponse } from "next/server";
import {
    requireAdminFromRequest,
    type RequireAdminHttpResult,
} from "@/modules/auth/adapters/input/http/require-admin";
import { mapReservationHttpError } from "@/modules/reservations/adapters/input/http/map-reservation-http-error";

export type ReservationHttpHandlerResult = {
    status?: number;
    body: unknown;
};

export async function handleReservationRoute(
    handler: () => Promise<ReservationHttpHandlerResult>,
): Promise<NextResponse> {
    try {
        const result = await handler();

        return NextResponse.json(result.body, {
            status: result.status ?? 200,
        });
    } catch (error) {
        return mapReservationHttpError(error);
    }
}

export async function requireAdminOrResponse(
    request: NextRequest,
): Promise<RequireAdminHttpResult> {
    return requireAdminFromRequest(request);
}