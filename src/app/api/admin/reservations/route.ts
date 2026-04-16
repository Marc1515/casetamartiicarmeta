// src/app/api/admin/reservations/route.ts
import type { NextRequest } from "next/server";
import { handleCreateReservation } from "@/modules/reservations/adapters/input/http/create-reservation.handler";
import { handleGetAdminReservations } from "@/modules/reservations/adapters/input/http/get-admin-reservations.handler";

export async function GET(request: NextRequest) {
  return handleGetAdminReservations(request);
}

export async function POST(request: NextRequest) {
  return handleCreateReservation(request);
}