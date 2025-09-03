"use client";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, type SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";

type ApiEvent = {
  id: string;
  title: string;
  start: string; // viene como string desde la API
  end: string;
  allDay?: boolean;
  notes?: string | null;
};

type Evt = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  notes?: string | null;
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay: (date: Date) => getDay(date),
  locales: { es },
});

export default function CalendarAdmin() {
  const [events, setEvents] = useState<Evt[]>([]);

  async function load() {
    const r = await fetch("/api/admin/events", { cache: "no-store" });
    if (r.status === 401) {
      window.location.href = "/login";
      return;
    }
    const data: ApiEvent[] = await r.json();
    setEvents(
      data.map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: e.allDay ?? true,
        notes: e.notes ?? null,
      }))
    );
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(ev: Omit<Evt, "id">) {
    await fetch("/api/admin/events", {
      method: "POST",
      body: JSON.stringify(ev),
    });
    void load();
  }
  async function update(ev: Evt) {
    await fetch(`/api/admin/events/${ev.id}`, {
      method: "PUT",
      body: JSON.stringify(ev),
    });
    void load();
  }
  async function remove(id: string) {
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    void load();
  }

  return (
    <div style={{ height: 650 }}>
      <Calendar<Evt>
        culture="es"
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        defaultView="month"
        onSelectSlot={(slot: SlotInfo) => {
          const { start, end } = slot;
          const title = window.prompt("Título de la reserva:", "Reserva");
          if (!title) return;
          void create({ title, start, end, allDay: true, notes: null });
        }}
        onSelectEvent={(ev: Evt) => {
          const action = window.prompt(
            `Editar título o escribe DELETE para borrar\nActual: ${ev.title}`,
            ev.title
          );
          if (!action) return;
          if (action.toUpperCase() === "DELETE") {
            if (confirm("¿Seguro?")) void remove(ev.id);
          } else {
            void update({ ...ev, title: action });
          }
        }}
      />
    </div>
  );
}
