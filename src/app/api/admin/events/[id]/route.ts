import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (token.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

type EventBody = {
  title?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  notes?: string | null;
};

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

  let body: EventBody;
  try {
    body = (await req.json()) as EventBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Solo validamos fechas si realmente se envían cambios
  const changingStart = body.start != null;
  const changingEnd = body.end != null;

  const start = changingStart ? new Date(body.start!) : existing.start;
  const end = changingEnd ? new Date(body.end!) : existing.end;

  if (
    (changingStart && Number.isNaN(start.getTime())) ||
    (changingEnd && Number.isNaN(end.getTime()))
  ) {
    return NextResponse.json(
      { error: "Fechas/horas inválidas" },
      { status: 400 }
    );
  }

  if (changingStart || changingEnd) {
    const now = new Date();

    if (changingStart && start < now) {
      return NextResponse.json(
        { error: "No se permiten fechas pasadas" },
        { status: 400 }
      );
    }
    if (end <= start) {
      return NextResponse.json(
        { error: "Fin debe ser posterior a inicio" },
        { status: 400 }
      );
    }

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
          overlapping,
        },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title?.trim() ?? undefined,
      start: changingStart || changingEnd ? start : undefined,
      end: changingStart || changingEnd ? end : undefined,
      allDay: body.allDay ?? undefined,
      notes: body.notes ?? undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
