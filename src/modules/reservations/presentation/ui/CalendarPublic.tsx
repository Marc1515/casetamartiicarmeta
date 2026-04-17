"use client";

import { useMemo } from "react";
import { Calendar } from "react-big-calendar";
import { eachDayOfInterval, format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { usePublicReservationCalendar } from "@/modules/reservations/presentation/hooks/usePublicReservationCalendar";
import type { ReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";
import { reservationCalendarLocalizer } from "@/modules/reservations/presentation/calendar/reservation-calendar.localizer";

type SupportedLocale = "ca" | "es" | "en" | "fr" | "de";

export default function CalendarPublic() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("calendarMessages");
  const tCal = useTranslations("calendar");
  const { events } = usePublicReservationCalendar();

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
      <Calendar<ReservationCalendarEvent>
        culture={locale}
        localizer={reservationCalendarLocalizer}
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
