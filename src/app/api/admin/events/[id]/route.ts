import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: body.title,
      start: new Date(body.start),
      end: new Date(body.end),
      allDay: body.allDay ?? true,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
