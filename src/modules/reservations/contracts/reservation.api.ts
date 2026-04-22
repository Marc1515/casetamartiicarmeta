export type AdminReservationApiResponse = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    createdById: string | null;
};

export type PublicReservationApiResponse = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
};

export type ReservationApiError = {
    error?: string;
    overlapping?: {
        id?: string;
        title?: string;
        start?: string;
        end?: string;
        allDay?: boolean;
        notes?: string | null;
        createdAt?: string;
        updatedAt?: string;
        createdById?: string | null;
    };
};