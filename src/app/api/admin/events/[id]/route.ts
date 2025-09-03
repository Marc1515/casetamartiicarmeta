import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // 👈 params es Promise
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params; // 👈 await
  const body = (await req.json()) as {
    title?: string;
    start?: string;
    end?: string;
    allDay?: boolean;
    notes?: string | null;
  };

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title ?? undefined,
      start: body.start ? new Date(body.start) : undefined,
      end: body.end ? new Date(body.end) : undefined,
      allDay: body.allDay ?? undefined,
      notes: body.notes ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // 👈 params es Promise
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params; // 👈 await
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
