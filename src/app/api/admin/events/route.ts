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

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const events = await prisma.event.findMany({ orderBy: { start: "asc" } });
  return NextResponse.json(events);
}

type EventBody = {
  title?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  notes?: string | null;
};

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const token = await getToken({ req });
  const userId = token?.sub ?? null;

  let body: EventBody;
  try {
    body = (await req.json()) as EventBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Título obligatorio" }, { status: 400 });
  }
  if (!body.start || !body.end) {
    return NextResponse.json(
      { error: "Inicio y fin son obligatorios" },
      { status: 400 }
    );
  }

  let start = new Date(body.start);
  let end = new Date(body.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json(
      { error: "Fechas/horas inválidas" },
      { status: 400 }
    );
  }

  // Clamp cómodo en creación
  const now = new Date();
  if (start < now) start = now;
  if (end <= start) end = new Date(start.getTime() + 30 * 60 * 1000);

  // Solape end-exclusivo
  const overlapping = await prisma.event.findFirst({
    where: { AND: [{ start: { lt: end } }, { end: { gt: start } }] },
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

  const event = await prisma.event.create({
    data: {
      title: body.title.trim(),
      start,
      end,
      allDay: body.allDay ?? false,
      notes: body.notes ?? null,
      createdById: userId ?? undefined,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
