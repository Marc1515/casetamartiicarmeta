import type { Reservation } from "@/modules/reservations/application/models/Reservation";

export type CreateReservationData = {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    notes?: string | null;
    createdById?: string | null;
};

export type UpdateReservationData = {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    notes?: string | null;
};

export interface ReservationRepository {
    findAllOrdered(): Promise<Reservation[]>;
    findById(id: string): Promise<Reservation | null>;
    findOverlapping(
        start: Date,
        end: Date,
        excludeId?: string,
    ): Promise<Reservation[]>;
    create(data: CreateReservationData): Promise<Reservation>;
    update(id: string, data: UpdateReservationData): Promise<Reservation>;
    delete(id: string): Promise<Reservation>;
}