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
import { ca, es, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

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
  locales: { ca, es, en: enUS },
});

export default function CalendarPublic() {
  const locale = useLocale() as "ca" | "es" | "en";
  const t = useTranslations("calendarMessages");
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
    <div className="public-calendar h-[320px] sm:h-[520px] lg:h-[600px] [@media(max-height:500px)]:h-[340px] [@media(max-height:420px)]:h-[280px]">
      <Calendar<Evt>
        culture={locale}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        defaultView="month"
        toolbar
        dayPropGetter={dayPropGetter}
        messages={{
          month: t("month"),
          week: t("week"),
          day: t("day"),
          today: t("today"),
          previous: t("previous"),
          next: t("next"),
        }}
      />
    </div>
  );
}
