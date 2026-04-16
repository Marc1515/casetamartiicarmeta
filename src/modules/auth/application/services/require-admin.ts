// src/modules/auth/application/services/require-admin.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

type AdminToken = {
    sub?: string;
    email?: string | null;
    role?: "ADMIN" | "VIEWER";
};

type RequireAdminSuccess = {
    ok: true;
    token: AdminToken;
};

type RequireAdminFailure = {
    ok: false;
    response: NextResponse;
};

export type RequireAdminResult = RequireAdminSuccess | RequireAdminFailure;

export async function requireAdmin(
    request: NextRequest,
): Promise<RequireAdminResult> {
    const token = (await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })) as AdminToken | null;

    if (!token) {
        return {
            ok: false,
            response: NextResponse.json(
                { error: "No autenticado" },
                { status: 401 },
            ),
        };
    }

    if (token.role !== "ADMIN") {
        return {
            ok: false,
            response: NextResponse.json(
                { error: "No autorizado" },
                { status: 403 },
            ),
        };
    }

    return {
        ok: true,
        token,
    };
}