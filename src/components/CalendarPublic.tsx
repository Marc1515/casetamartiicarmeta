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
      const res = await fetch("/api/public/events");
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

  return (
    <div style={{ height: 600 }}>
      <Calendar<Evt>
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        defaultView="month"
        toolbar
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
