import type { CSSProperties } from "react";
import { getDay } from "date-fns";
import { ADMIN_RESERVATION_CALENDAR_PALETTE } from "@/modules/reservations/presentation/calendar/reservation-admin-calendar.constants";
import type { AdminReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";

function hashString(value: string): number {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

export function getAdminReservationEventStyle(
    event: AdminReservationCalendarEvent,
    highlightedId: string | null,
    isSelected?: boolean,
): { style: CSSProperties } {
    if (event.id === highlightedId) {
        return {
            style: {
                outline: "3px solid #f59e0b",
                backgroundColor: "#fff7ed",
                color: "#7c2d12",
                boxShadow: "0 0 0 2px rgba(245,158,11,.25) inset",
            },
        };
    }

    const index =
        hashString(`${event.id}|${event.title}`) %
        ADMIN_RESERVATION_CALENDAR_PALETTE.length;

    const paletteColor = ADMIN_RESERVATION_CALENDAR_PALETTE[index];

    const style: CSSProperties = {
        backgroundColor: paletteColor.bg,
        borderColor: paletteColor.bg,
        color: paletteColor.text,
    };

    const duration = event.end.getTime() - event.start.getTime();

    if (duration >= 2 * 24 * 60 * 60 * 1000) {
        style.filter = "brightness(0.95)";
    }

    if (isSelected) {
        style.boxShadow = "0 0 0 2px rgba(255,255,255,0.25) inset";
    }

    return { style };
}

export function getAdminReservationDayProps(date: Date): {
    className?: string;
} {
    const isWeekend = [0, 6].includes(getDay(date));

    return isWeekend ? { className: "rbc-weekend" } : {};
}