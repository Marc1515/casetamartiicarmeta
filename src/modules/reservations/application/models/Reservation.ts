export type Reservation = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdById: string | null;
};

export type PublicReservation = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
};