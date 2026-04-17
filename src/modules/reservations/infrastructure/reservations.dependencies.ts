import { PrismaReservationRepository } from "@/modules/reservations/adapters/output/persistence/PrismaReservationRepository";
import type { ReservationRepository } from "@/modules/reservations/application/ports/ReservationRepository";
import { CreateReservationUseCase } from "@/modules/reservations/application/use-cases/CreateReservationUseCase";
import { DeleteReservationUseCase } from "@/modules/reservations/application/use-cases/DeleteReservationUseCase";
import { GetAdminReservationsUseCase } from "@/modules/reservations/application/use-cases/GetAdminReservationsUseCase";
import { GetPublicReservationsUseCase } from "@/modules/reservations/application/use-cases/GetPublicReservationsUseCase";
import { UpdateReservationUseCase } from "@/modules/reservations/application/use-cases/UpdateReservationUseCase";

function makeReservationRepository(): ReservationRepository {
    return new PrismaReservationRepository();
}

export function makeGetAdminReservationsUseCase(): GetAdminReservationsUseCase {
    return new GetAdminReservationsUseCase(makeReservationRepository());
}

export function makeGetPublicReservationsUseCase(): GetPublicReservationsUseCase {
    return new GetPublicReservationsUseCase(makeReservationRepository());
}

export function makeCreateReservationUseCase(): CreateReservationUseCase {
    return new CreateReservationUseCase(makeReservationRepository());
}

export function makeUpdateReservationUseCase(): UpdateReservationUseCase {
    return new UpdateReservationUseCase(makeReservationRepository());
}

export function makeDeleteReservationUseCase(): DeleteReservationUseCase {
    return new DeleteReservationUseCase(makeReservationRepository());
}