// src/components/CalendarPublic.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  eachDayOfInterval,
} from "date-fns";
import { es } from "date-fns/locale";

type ApiEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
};
type Evt = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay: (date: Date) => getDay(date),
  locales: { es },
});

export default function CalendarPublic() {
  const [events, setEvents] = useState<Evt[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/public/events", { cache: "no-store" });
      const data: ApiEvent[] = await res.json();
      setEvents(
        data.map((e) => ({
          id: e.id,
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end),
          allDay: e.allDay ?? true,
        }))
      );
    })();
  }, []);

  // Precalcula un Set con todos los días ocupados (yyyy-MM-dd)
  const busyDays = useMemo(() => {
    const s = new Set<string>();
    for (const ev of events) {
      // evitamos incluir el día "end" si termina justo a medianoche del día siguiente
      const endMinus = new Date(ev.end.getTime() - 1);
      for (const d of eachDayOfInterval({ start: ev.start, end: endMinus })) {
        s.add(format(d, "yyyy-MM-dd"));
      }
    }
    return s;
  }, [events]);

  // Marca las celdas del mes que están ocupadas
  function dayPropGetter(date: Date) {
    const key = format(date, "yyyy-MM-dd");
    if (busyDays.has(key)) {
      return { className: "is-busy-day" };
    }
    return {};
  }

  return (
    <div className="public-calendar" style={{ height: 600 }}>
      <Calendar<Evt>
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        defaultView="month"
        toolbar
        dayPropGetter={dayPropGetter}
        messages={{
          month: "Mes",
          week: "Semana",
          day: "Día",
          today: "Hoy",
          previous: "Atrás",
          next: "Siguiente",
        }}
      />
    </div>
  );
}
