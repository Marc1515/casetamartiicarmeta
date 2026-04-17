// src/modules/reservations/adapters/input/http/reservation-response.dto.ts
export type AdminReservationResponseDto = {
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

export type PublicReservationResponseDto = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
};