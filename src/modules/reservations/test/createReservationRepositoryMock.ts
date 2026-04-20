import { vi } from "vitest";
import type {
    CreateReservationData,
    ReservationRepository,
    UpdateReservationData,
} from "@/modules/reservations/application/ports/ReservationRepository";
import type { Reservation } from "@/modules/reservations/application/models/Reservation";

type ReservationRepositoryMock = {
    findAllOrdered: ReturnType<typeof vi.fn<() => Promise<Reservation[]>>>;
    findById: ReturnType<typeof vi.fn<(id: string) => Promise<Reservation | null>>>;
    findOverlapping: ReturnType<
        typeof vi.fn<
            (
                start: Date,
                end: Date,
                excludeId?: string,
            ) => Promise<Reservation[]>
        >
    >;
    create: ReturnType<
        typeof vi.fn<(data: CreateReservationData) => Promise<Reservation>>
    >;
    update: ReturnType<
        typeof vi.fn<(id: string, data: UpdateReservationData) => Promise<Reservation>>
    >;
    delete: ReturnType<typeof vi.fn<(id: string) => Promise<Reservation>>>;
};

export function createReservationRepositoryMock(): ReservationRepository &
    ReservationRepositoryMock {
    const repository: ReservationRepositoryMock = {
        findAllOrdered: vi.fn<() => Promise<Reservation[]>>(),
        findById: vi.fn<(id: string) => Promise<Reservation | null>>(),
        findOverlapping: vi.fn<
            (
                start: Date,
                end: Date,
                excludeId?: string,
            ) => Promise<Reservation[]>
        >(),
        create: vi.fn<(data: CreateReservationData) => Promise<Reservation>>(),
        update: vi.fn<(id: string, data: UpdateReservationData) => Promise<Reservation>>(),
        delete: vi.fn<(id: string) => Promise<Reservation>>(),
    };

    return repository;
}