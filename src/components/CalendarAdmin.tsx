"use client";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";

type ApiEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  notes?: string | null;
};

export type Evt = {
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
        allDay: e.allDay ?? false,
        notes: e.notes ?? null,
      }))
    );
  }

  useEffect(() => {
    void load();
    const reload = () => void load();
    window.addEventListener("admin:events:changed", reload);
    return () => window.removeEventListener("admin:events:changed", reload);
  }, []);

  function openEdit(ev: Evt) {
    window.dispatchEvent(new CustomEvent("admin:event:edit", { detail: ev }));
    // Desplaza a la zona del formulario por comodidad
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div style={{ height: 650 }}>
      <Calendar<Evt>
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        defaultView="month"
        onSelectEvent={openEdit}
      />
      <p className="mt-2 text-sm text-gray-600">
        Haz clic en un evento para editarlo abajo.
      </p>
    </div>
  );
}
