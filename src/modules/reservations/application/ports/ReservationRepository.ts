export type ReservationRecord = {
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
    findAllOrdered(): Promise<ReservationRecord[]>;
    findById(id: string): Promise<ReservationRecord | null>;
    findOverlapping(
        start: Date,
        end: Date,
        excludeId?: string,
    ): Promise<ReservationRecord[]>;
    create(data: CreateReservationData): Promise<ReservationRecord>;
    update(id: string, data: UpdateReservationData): Promise<ReservationRecord>;
    delete(id: string): Promise<ReservationRecord>;
}