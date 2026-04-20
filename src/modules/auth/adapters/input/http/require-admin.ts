import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
    validateAdminAccess,
    type AdminAccessToken,
} from "@/modules/auth/application/services/validate-admin-access";

export type RequireAdminHttpResult =
    | {
        ok: true;
        token: AdminAccessToken;
    }
    | {
        ok: false;
        response: NextResponse;
    };

export async function requireAdminFromRequest(
    request: NextRequest,
): Promise<RequireAdminHttpResult> {
    const token = (await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })) as AdminAccessToken | null;

    const result = validateAdminAccess(token);

    if (!result.ok) {
        if (result.reason === "UNAUTHENTICATED") {
            return {
                ok: false,
                response: NextResponse.json(
                    { error: "No autenticado" },
                    { status: 401 },
                ),
            };
        }

        return {
            ok: false,
            response: NextResponse.json(
                { error: "No autorizado" },
                { status: 403 },
            ),
        };
    }

    return result;
}