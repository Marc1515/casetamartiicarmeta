"use client";

import { useMemo } from "react";
import { Calendar } from "react-big-calendar";
import { useLocale, useTranslations } from "next-intl";
import { usePublicReservationCalendar } from "@/modules/reservations/presentation/hooks/usePublicReservationCalendar";
import type { ReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";
import { reservationCalendarLocalizer } from "@/modules/reservations/presentation/calendar/reservation-calendar.localizer";
import {
  buildBusyDaySet,
  getPublicReservationDayProps,
} from "@/modules/reservations/presentation/calendar/reservation-public-calendar.utils";

type SupportedLocale = "ca" | "es" | "en" | "fr" | "de";

export default function CalendarPublic() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("calendarMessages");
  const tCal = useTranslations("calendar");
  const { events } = usePublicReservationCalendar();

  const busyDays = useMemo(() => buildBusyDaySet(events), [events]);

  function dayPropGetter(date: Date) {
    return getPublicReservationDayProps(date, busyDays, tCal("reserved"));
  }

  return (
    <div className="public-calendar h-[320px] [@media(max-height:420px)]:h-[280px] [@media(max-height:500px)]:h-[340px] sm:h-[520px] lg:h-[450px]">
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
