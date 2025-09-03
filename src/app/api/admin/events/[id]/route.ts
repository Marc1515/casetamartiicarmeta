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
  ctx: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;

  const existing = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      start: true,
      end: true,
      title: true,
      allDay: true,
      notes: true,
    },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "Reserva no encontrada" },
      { status: 404 }
    );
  }

  const body = (await req.json()) as {
    title?: string;
    start?: string;
    end?: string;
    allDay?: boolean;
    notes?: string | null;
  };

  // Propuesta final de tiempos (usa los existentes si no vienen en body)
  let start = body.start ? new Date(body.start) : existing.start;
  let end = body.end ? new Date(body.end) : existing.end;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json(
      { error: "Fechas/horas inválidas" },
      { status: 400 }
    );
  }

  // clamp básico
  const now = new Date();
  if (start < now) start = now;
  if (end <= start) end = new Date(start.getTime() + 30 * 60 * 1000);

  // SOLAPE (end exclusivo) excluyendo el propio id
  const overlapping = await prisma.event.findFirst({
    where: {
      id: { not: id },
      AND: [{ start: { lt: end } }, { end: { gt: start } }],
    },
    select: { id: true, title: true, start: true, end: true },
  });
  if (overlapping) {
    return NextResponse.json(
      {
        error:
          "Las fechas/horas seleccionadas solapan con una reserva existente.",
      },
      { status: 409 }
    );
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title?.trim() ?? existing.title,
      start,
      end,
      allDay: body.allDay ?? existing.allDay,
      notes: body.notes ?? existing.notes,
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
