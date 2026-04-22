import { handleGetPublicReservations } from "@/modules/reservations/adapters/input/http/get-public-reservations.handler";

export async function GET() {
  return handleGetPublicReservations();
}