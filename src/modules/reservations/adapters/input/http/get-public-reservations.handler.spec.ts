import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleGetPublicReservations } from "@/modules/reservations/adapters/input/http/get-public-reservations.handler";
import { buildReservation } from "@/modules/reservations/test/buildReservation";

const { executeMock, makeUseCaseMock } = vi.hoisted(() => {
    return {
        executeMock: vi.fn(),
        makeUseCaseMock: vi.fn(),
    };
});

vi.mock("@/modules/reservations/infrastructure/reservations.dependencies", () => {
    return {
        makeGetPublicReservationsUseCase: makeUseCaseMock,
    };
});

describe("handleGetPublicReservations", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        makeUseCaseMock.mockReturnValue({
            execute: executeMock,
        });
    });

    it("returns public reservations when success", async () => {
        const reservations = [
            buildReservation({
                id: "1",
                title: "Reserva 1",
                notes: "privadas",
                createdById: "admin-1",
            }),
            buildReservation({
                id: "2",
                title: "Reserva 2",
                notes: "más privadas",
                createdById: "admin-2",
            }),
        ];

        executeMock.mockResolvedValue([
            {
                id: reservations[0].id,
                title: reservations[0].title,
                start: reservations[0].start,
                end: reservations[0].end,
                allDay: reservations[0].allDay,
            },
            {
                id: reservations[1].id,
                title: reservations[1].title,
                start: reservations[1].start,
                end: reservations[1].end,
                allDay: reservations[1].allDay,
            },
        ]);

        const response = await handleGetPublicReservations({} as never);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual([
            {
                id: "1",
                title: "Reserva 1",
                start: reservations[0].start.toISOString(),
                end: reservations[0].end.toISOString(),
                allDay: reservations[0].allDay,
            },
            {
                id: "2",
                title: "Reserva 2",
                start: reservations[1].start.toISOString(),
                end: reservations[1].end.toISOString(),
                allDay: reservations[1].allDay,
            },
        ]);
    });

    it("returns an empty list when there are no reservations", async () => {
        executeMock.mockResolvedValue([]);

        const response = await handleGetPublicReservations({} as never);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual([]);
    });
});