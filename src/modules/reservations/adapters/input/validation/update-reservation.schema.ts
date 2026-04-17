import { z } from "zod";
import { reservationPayloadSchema } from "@/modules/reservations/adapters/input/validation/reservation-payload.schema";

export const updateReservationSchema = reservationPayloadSchema;

export type UpdateReservationSchema = z.infer<
    typeof updateReservationSchema
>;