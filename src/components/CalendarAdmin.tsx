"use client";
import { useEffect, useRef, useState } from "react";
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
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  async function load() {
    const r = await fetch("/api/admin/events", { cache: "no-store" });
    if (!r.ok) return;
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

    // ✅ Handler correcto: toma Event, castea dentro y NO devuelve nada
    const onHighlight = (ev: CustomEvent<{ id: string }>) => {
      const { id } = ev.detail;
      setHighlightedId(id);

      if (highlightTimeoutRef.current)
        clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedId((curr) => (curr === id ? null : curr));
        highlightTimeoutRef.current = null;
      }, 3000);
    };

    window.addEventListener("admin:event:highlight", onHighlight);

    return () => {
      window.removeEventListener("admin:event:highlight", onHighlight);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
    };
  }, []);

  // ✅ Faltaba esta función
  function openEdit(ev: Evt) {
    window.dispatchEvent(new CustomEvent("admin:event:edit", { detail: ev }));
  }

  function eventPropGetter(event: Evt) {
    if (event.id === highlightedId) {
      return {
        style: {
          outline: "3px solid #f59e0b",
          backgroundColor: "#fff7ed",
          boxShadow: "0 0 0 2px rgba(245,158,11,.25) inset",
        },
      };
    }
    return {};
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
        eventPropGetter={eventPropGetter}
      />
      <p className="mt-2 text-sm text-gray-600">
        Haz clic en un evento para editarlo.
      </p>
    </div>
  );
}
