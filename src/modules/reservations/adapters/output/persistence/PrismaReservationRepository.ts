// src/modules/reservations/adapters/output/persistence/PrismaReservationRepository.ts
import { prisma } from "@/shared/infrastructure/prisma/prisma";

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

export class PrismaReservationRepository {
    async findAllOrdered(): Promise<ReservationRecord[]> {
        const reservations = await prisma.event.findMany({
            orderBy: [
                { start: "asc" },
                { end: "asc" },
                { createdAt: "asc" },
            ],
        });

        return reservations;
    }

    async findById(id: string): Promise<ReservationRecord | null> {
        const reservation = await prisma.event.findUnique({
            where: { id },
        });

        return reservation;
    }

    async findOverlapping(
        start: Date,
        end: Date,
        excludeId?: string,
    ): Promise<ReservationRecord[]> {
        const reservations = await prisma.event.findMany({
            where: {
                ...(excludeId
                    ? {
                        NOT: {
                            id: excludeId,
                        },
                    }
                    : {}),
                start: {
                    lt: end,
                },
                end: {
                    gt: start,
                },
            },
            orderBy: [
                { start: "asc" },
                { end: "asc" },
            ],
        });

        return reservations;
    }

    async create(data: CreateReservationData): Promise<ReservationRecord> {
        const reservation = await prisma.event.create({
            data: {
                title: data.title,
                start: data.start,
                end: data.end,
                allDay: data.allDay ?? true,
                notes: data.notes ?? null,
                createdById: data.createdById ?? null,
            },
        });

        return reservation;
    }

    async update(
        id: string,
        data: UpdateReservationData,
    ): Promise<ReservationRecord> {
        const reservation = await prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                start: data.start,
                end: data.end,
                allDay: data.allDay ?? true,
                notes: data.notes ?? null,
            },
        });

        return reservation;
    }

    async delete(id: string): Promise<ReservationRecord> {
        const reservation = await prisma.event.delete({
            where: { id },
        });

        return reservation;
    }
}