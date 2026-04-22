import { addDays, addMinutes } from "date-fns";
import type { ReservationFormValues } from "@/modules/reservations/presentation/ui/reservation-form.schema";

function getNextHalfHour(now: Date): Date {
    const roundedDate = new Date(now);
    const remainder = roundedDate.getMinutes() % 30;
    const minutesToAdd = remainder === 0 ? 30 : 30 - remainder;

    roundedDate.setMinutes(roundedDate.getMinutes() + minutesToAdd);
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);

    return roundedDate;
}

export function buildCreateReservationDefaultValues(
    now: Date = new Date(),
): ReservationFormValues {
    const start = getNextHalfHour(now);
    const end = addDays(start, 1);

    return {
        title: "Reserva",
        start,
        end,
        notes: "",
    };
}

export function buildEditReservationDefaultValues(
    now: Date = new Date(),
): ReservationFormValues {
    return {
        title: "",
        start: now,
        end: addMinutes(now, 30),
        notes: "",
    };
}