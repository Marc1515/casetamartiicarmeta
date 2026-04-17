import { NextResponse } from "next/server";

export type RouteHandlerResult<T> = {
    status?: number;
    data: T;
};

export async function handleRoute<T>(
    handler: () => Promise<RouteHandlerResult<T>>,
): Promise<NextResponse> {
    try {
        const result = await handler();

        return NextResponse.json(result.data, {
            status: result.status ?? 200,
        });
    } catch (error) {
        console.error("[API ERROR]", error);

        return NextResponse.json(
            {
                error: "Error interno del servidor",
            },
            { status: 500 },
        );
    }
}