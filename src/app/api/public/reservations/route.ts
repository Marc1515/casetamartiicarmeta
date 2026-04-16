import { NextResponse } from "next/server";
import { prisma } from "@/shared/infrastructure/prisma/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { start: "asc" },
  });

  // En público no exponemos datos sensibles: solo "Ocupado"
  const sanitized = events.map((e) => ({
    id: e.id,
    title: "Ocupado",
    start: e.start,
    end: e.end,
    allDay: e.allDay,
  }));

  return NextResponse.json(sanitized);
}
