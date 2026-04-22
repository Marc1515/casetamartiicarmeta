import { eachDayOfInterval, format } from "date-fns";
import type { ReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";

export function buildBusyDaySet(
    events: ReservationCalendarEvent[],
): Set<string> {
    const busyDaySet = new Set<string>();

    for (const event of events) {
        const endMinus = new Date(event.end.getTime() - 1);

        for (const day of eachDayOfInterval({
            start: event.start,
            end: endMinus,
        })) {
            busyDaySet.add(format(day, "yyyy-MM-dd"));
        }
    }

    return busyDaySet;
}

export function getPublicReservationDayProps(
    date: Date,
    busyDays: Set<string>,
    reservedLabel: string,
): {
    className?: string;
    style?: React.CSSProperties;
} {
    const key = format(date, "yyyy-MM-dd");

    if (busyDays.has(key)) {
        return {
            className: "is-busy-day",
            style: {
                "--reserved-label": `"${reservedLabel}"`,
            } as React.CSSProperties,
        };
    }

    return {};
}