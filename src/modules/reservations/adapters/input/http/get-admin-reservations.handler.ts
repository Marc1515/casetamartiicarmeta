// src/modules/reservations/adapters/input/http/get-admin-reservations.handler.ts
import { NextRequest, NextResponse } from "next/server";

export async function handleGetAdminReservations(
    _request: NextRequest,
): Promise<NextResponse> {
    try {
        return NextResponse.json([], { status: 200 });
    } catch (error) {
        console.error("Error fetching admin reservations:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}