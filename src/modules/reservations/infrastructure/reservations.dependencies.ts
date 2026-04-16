// src/modules/reservations/infrastructure/reservations.dependencies.ts
import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";
import { CreateReservationUseCase } from "@/modules/reservations/application/use-cases/CreateReservationUseCase";
import { DeleteReservationUseCase } from "@/modules/reservations/application/use-cases/DeleteReservationUseCase";
import { GetAdminReservationsUseCase } from "@/modules/reservations/application/use-cases/GetAdminReservationsUseCase";
import { GetPublicReservationsUseCase } from "@/modules/reservations/application/use-cases/GetPublicReservationsUseCase";
import { UpdateReservationUseCase } from "@/modules/reservations/application/use-cases/UpdateReservationUseCase";

export function makeGetAdminReservationsUseCase(): GetAdminReservationsUseCase {
    const reservationRepository = new PrismaReservationRepository();

    return new GetAdminReservationsUseCase(reservationRepository);
}

export function makeGetPublicReservationsUseCase(): GetPublicReservationsUseCase {
    const reservationRepository = new PrismaReservationRepository();

    return new GetPublicReservationsUseCase(reservationRepository);
}

export function makeCreateReservationUseCase(): CreateReservationUseCase {
    const reservationRepository = new PrismaReservationRepository();

    return new CreateReservationUseCase(reservationRepository);
}

export function makeUpdateReservationUseCase(): UpdateReservationUseCase {
    const reservationRepository = new PrismaReservationRepository();

    return new UpdateReservationUseCase(reservationRepository);
}

export function makeDeleteReservationUseCase(): DeleteReservationUseCase {
    const reservationRepository = new PrismaReservationRepository();

    return new DeleteReservationUseCase(reservationRepository);
}