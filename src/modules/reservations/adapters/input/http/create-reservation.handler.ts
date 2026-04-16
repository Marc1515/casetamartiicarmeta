// src/modules/reservations/adapters/input/http/create-reservation.handler.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/application/services/require-admin";

export async function handleCreateReservation(
    request: NextRequest,
): Promise<NextResponse> {
    try {
        const adminResult = await requireAdmin(request);

        if (!adminResult.ok) {
            return adminResult.response;
        }

        // Si llegamos aquí, el usuario es admin
        const adminToken = adminResult.token;

        // 2. parsear body
        const body: unknown = await request.json();

        // 3. validar body

        // 4. ejecutar caso de uso

        // 5. devolver respuesta
        return NextResponse.json(
            {
                message: "Reserva creada correctamente",
                adminUserId: adminToken.sub ?? null,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating reservation:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}