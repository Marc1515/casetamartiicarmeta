"use client";

import { Plus } from "lucide-react";
import CalendarAdmin from "@/modules/reservations/presentation/ui/CalendarAdmin";
import LogoutButton from "@/modules/auth/presentation/ui/LogoutButton";
import EditReservaModal from "@/modules/reservations/presentation/ui/EditReservaModal";
import CreateReservaModal from "@/modules/reservations/presentation/ui/CreateReservaModal";
import {
  ReservationAdminCoordinatorProvider,
  useReservationAdminCoordinator,
} from "@/modules/reservations/presentation/state/ReservationAdminCoordinator";
import { Button } from "@/shared/presentation/ui/button";

function AdminCalendarPageContent() {
  const { openCreate } = useReservationAdminCoordinator();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-4 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:gap-6 lg:px-8">
        <header className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Panel de reservas
            </h1>
            <p className="mt-1 text-sm text-slate-600 [@media(max-height:500px)]:hidden">
              Gestiona el calendario y las reservas de la caseta desde esta
              vista.
            </p>
          </div>
          <div className="flex justify-end">
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-1">
          <div className="rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Calendario
              </h2>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-100"
                onClick={openCreate}
                aria-label="Crear reserva"
                title="Crear reserva"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-2 sm:p-3">
              <CalendarAdmin />
            </div>
          </div>
        </section>

        <EditReservaModal />
        <CreateReservaModal />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <ReservationAdminCoordinatorProvider>
      <AdminCalendarPageContent />
    </ReservationAdminCoordinatorProvider>
  );
}
