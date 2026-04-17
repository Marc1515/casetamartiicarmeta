"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAdminReservations } from "@/modules/reservations/presentation/api/reservations.client";
import {
    emitAdminReservationEdit,
    onAdminReservationHighlight,
    onAdminReservationsChanged,
} from "@/modules/reservations/presentation/events/reservation-admin.events";
import { toAdminReservationCalendarEventList } from "@/modules/reservations/presentation/mappers/reservation-calendar.mapper";
import type { AdminReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";

type UseAdminReservationCalendarResult = {
    events: AdminReservationCalendarEvent[];
    highlightedId: string | null;
    openEdit: (event: AdminReservationCalendarEvent) => void;
    reload: () => Promise<void>;
};

export function useAdminReservationCalendar(): UseAdminReservationCalendarResult {
    const [events, setEvents] = useState<AdminReservationCalendarEvent[]>([]);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const load = useCallback(async (): Promise<void> => {
        const result = await getAdminReservations();

        if (!result.ok) {
            return;
        }

        setEvents(toAdminReservationCalendarEventList(result.data));
    }, []);

    useEffect(() => {
        void load();

        const unsubscribeReload = onAdminReservationsChanged(() => {
            void load();
        });

        const unsubscribeHighlight = onAdminReservationHighlight(({ id }) => {
            setHighlightedId(id);

            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }

            highlightTimeoutRef.current = setTimeout(() => {
                setHighlightedId((currentId) => (currentId === id ? null : currentId));
                highlightTimeoutRef.current = null;
            }, 4000);
        });

        return () => {
            unsubscribeReload();
            unsubscribeHighlight();

            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
                highlightTimeoutRef.current = null;
            }
        };
    }, [load]);

    const openEdit = useCallback((event: AdminReservationCalendarEvent) => {
        emitAdminReservationEdit(event);
    }, []);

    return {
        events,
        highlightedId,
        openEdit,
        reload: load,
    };
}