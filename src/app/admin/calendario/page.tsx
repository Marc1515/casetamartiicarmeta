import CalendarAdmin from "@/components/CalendarAdmin";
import LogoutButton from "@/components/LogoutButton";
import ReservaForm from "@/components/ReservaForm";
import EditReservaModal from "@/components/EditReservaModal";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 lg:px-8">
        <header className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Panel de reservas
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Gestiona el calendario y las reservas de la caseta desde esta
              vista.
            </p>
          </div>
          <div className="flex justify-end">
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Calendario
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Vista general
              </span>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-2 sm:p-3">
              <CalendarAdmin />
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Crear / editar reserva
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Completa los datos para añadir una nueva reserva o modificar una
                existente seleccionada en el calendario.
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <ReservaForm />
            </div>
          </div>
        </section>

        <EditReservaModal />
      </div>
    </main>
  );
}
