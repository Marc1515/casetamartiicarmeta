"use client";

import { useCallback, useEffect, useState } from "react";
import { getPublicReservations } from "@/modules/reservations/presentation/api/reservations.client";
import { toPublicReservationCalendarEventList } from "@/modules/reservations/presentation/mappers/reservation-calendar.mapper";
import type { ReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";

type UsePublicReservationCalendarResult = {
    events: ReservationCalendarEvent[];
    reload: () => Promise<void>;
};

export function usePublicReservationCalendar(): UsePublicReservationCalendarResult {
    const [events, setEvents] = useState<ReservationCalendarEvent[]>([]);

    const load = useCallback(async (): Promise<void> => {
        const result = await getPublicReservations();

        if (!result.ok) {
            return;
        }

        setEvents(toPublicReservationCalendarEventList(result.data));
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        events,
        reload: load,
    };
}