import CalendarAdmin from "@/components/CalendarAdmin";
import LogoutButton from "@/components/LogoutButton";
import ReservaForm from "@/components/ReservaForm";
import EditReservaModal from "@/components/EditReservaModal";

export default function Page() {
  return (
    <main className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendario (admin)</h1>
        <LogoutButton />
      </div>

      <CalendarAdmin />
      <ReservaForm />
      <EditReservaModal />
    </main>
  );
}
