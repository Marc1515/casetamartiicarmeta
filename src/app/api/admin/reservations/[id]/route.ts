import { NextRequest } from "next/server";
import { handleDeleteReservation } from "@/modules/reservations/adapters/input/http/delete-reservation.handler";
import { handleUpdateReservation } from "@/modules/reservations/adapters/input/http/update-reservation.handler";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return handleUpdateReservation(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return handleDeleteReservation(request, context);
}