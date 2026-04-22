// src/modules/reservations/adapters/input/http/map-reservation-http-error.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function mapReservationHttpError(error: unknown): NextResponse {
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: "Datos inválidos",
                details: error.flatten(),
            },
            { status: 400 },
        );
    }

    console.error("Unhandled reservation HTTP error:", error);

    return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 },
    );
}