import { NextRequest } from "next/server";
import { handleGetPublicReservations } from "@/modules/reservations/adapters/input/http/get-public-reservations.handler";

export async function GET(request: NextRequest) {
  return handleGetPublicReservations(request);
}