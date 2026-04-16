// src/modules/reservations/adapters/input/http/get-public-reservations.handler.ts
import { NextRequest, NextResponse } from "next/server";

export async function handleGetPublicReservations(
    _request: NextRequest,
): Promise<NextResponse> {
    try {
        return NextResponse.json([], { status: 200 });
    } catch (error) {
        console.error("Error fetching public reservations:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}