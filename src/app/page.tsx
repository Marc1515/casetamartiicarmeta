import CalendarPublic from "@/components/CalendarPublic";

export default function Home() {
  return (
    <main className="container mx-auto p-6 space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Caseta Martí i Carmeta</h1>
        <p>Disponibilidad del alojamiento:</p>
      </section>
      <CalendarPublic />
    </main>
  );
}
