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
import { ca, es, enUS, fr, de } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { getPublicReservations } from "@/modules/reservations/presentation/api/reservations.client";

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
  locales: { ca, es, en: enUS, fr, de },
});

export default function CalendarPublic() {
  const locale = useLocale() as "ca" | "es" | "en" | "fr" | "de";
  const t = useTranslations("calendarMessages");
  const tCal = useTranslations("calendar");
  const [events, setEvents] = useState<Evt[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getPublicReservations();

      if (!result.ok) {
        return;
      }

      setEvents(
        result.data.map((reservation) => ({
          id: reservation.id,
          title: reservation.title,
          start: new Date(reservation.start),
          end: new Date(reservation.end),
          allDay: reservation.allDay ?? true,
        })),
      );
    })();
  }, []);

  const busyDays = useMemo(() => {
    const busyDaySet = new Set<string>();

    for (const event of events) {
      const endMinus = new Date(event.end.getTime() - 1);

      for (const day of eachDayOfInterval({
        start: event.start,
        end: endMinus,
      })) {
        busyDaySet.add(format(day, "yyyy-MM-dd"));
      }
    }

    return busyDaySet;
  }, [events]);

  function dayPropGetter(date: Date) {
    const key = format(date, "yyyy-MM-dd");

    if (busyDays.has(key)) {
      return {
        className: "is-busy-day",
        style: {
          "--reserved-label": `"${tCal("reserved")}"`,
        } as React.CSSProperties,
      };
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
