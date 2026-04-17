export type ReservationCalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
};

export type AdminReservationCalendarEvent = ReservationCalendarEvent & {
    notes?: string | null;
};