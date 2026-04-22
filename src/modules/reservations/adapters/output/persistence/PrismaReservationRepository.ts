import { prisma } from "@/shared/infrastructure/prisma/prisma";
import type {
    CreateReservationData,
    ReservationRepository,
    UpdateReservationData,
} from "@/modules/reservations/application/ports/ReservationRepository";
import type { Reservation } from "@/modules/reservations/application/models/Reservation";
import {
    toReservationPersistenceModel,
    toReservationPersistenceModelList,
} from "@/modules/reservations/adapters/output/persistence/reservation-persistence.mapper";

export class PrismaReservationRepository implements ReservationRepository {
    async findAllOrdered(): Promise<Reservation[]> {
        const reservations = await prisma.event.findMany({
            orderBy: [{ start: "asc" }, { end: "asc" }, { createdAt: "asc" }],
        });

        return toReservationPersistenceModelList(reservations);
    }

    async findById(id: string): Promise<Reservation | null> {
        const reservation = await prisma.event.findUnique({
            where: { id },
        });

        if (!reservation) {
            return null;
        }

        return toReservationPersistenceModel(reservation);
    }

    async findOverlapping(
        start: Date,
        end: Date,
        excludeId?: string,
    ): Promise<Reservation[]> {
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
            orderBy: [{ start: "asc" }, { end: "asc" }],
        });

        return toReservationPersistenceModelList(reservations);
    }

    async create(data: CreateReservationData): Promise<Reservation> {
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

        return toReservationPersistenceModel(reservation);
    }

    async update(
        id: string,
        data: UpdateReservationData,
    ): Promise<Reservation> {
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

        return toReservationPersistenceModel(reservation);
    }

    async delete(id: string): Promise<Reservation> {
        const reservation = await prisma.event.delete({
            where: { id },
        });

        return toReservationPersistenceModel(reservation);
    }
}