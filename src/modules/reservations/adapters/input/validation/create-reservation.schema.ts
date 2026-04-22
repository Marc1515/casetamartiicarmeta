import { z } from "zod";
import { reservationPayloadSchema } from "@/modules/reservations/adapters/input/validation/reservation-payload.schema";

export const createReservationSchema = reservationPayloadSchema;

export type CreateReservationSchema = z.infer<
    typeof createReservationSchema
>;