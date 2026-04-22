import type { Event } from "@prisma/client";
import type { Reservation } from "@/modules/reservations/application/models/Reservation";

export function toReservationPersistenceModel(event: Event): Reservation {
    return {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        notes: event.notes,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        createdById: event.createdById,
    };
}

export function toReservationPersistenceModelList(
    events: Event[],
): Reservation[] {
    return events.map(toReservationPersistenceModel);
}