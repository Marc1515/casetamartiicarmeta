"use client";

import { Calendar } from "react-big-calendar";
import { useAdminReservationCalendar } from "@/modules/reservations/presentation/hooks/useAdminReservationCalendar";
import type { AdminReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";
import { reservationCalendarLocalizer } from "@/modules/reservations/presentation/calendar/reservation-calendar.localizer";
import { ADMIN_RESERVATION_CALENDAR_MESSAGES } from "@/modules/reservations/presentation/calendar/reservation-admin-calendar.constants";
import {
  getAdminReservationDayProps,
  getAdminReservationEventStyle,
} from "@/modules/reservations/presentation/calendar/reservation-admin-calendar.utils";
import AdminReservationCalendarToolbar from "@/modules/reservations/presentation/calendar/AdminReservationCalendarToolbar";

export default function CalendarAdmin() {
  const { events, highlightedId, openEdit } = useAdminReservationCalendar();

  function eventPropGetter(
    event: AdminReservationCalendarEvent,
    _start?: Date,
    _end?: Date,
    isSelected?: boolean,
  ) {
    return getAdminReservationEventStyle(event, highlightedId, isSelected);
  }

  return (
    <div className="admin-calendar h-[320px] sm:h-[600px] lg:h-[650px] [@media(max-height:500px)]:h-[340px] [@media(max-height:420px)]:h-[280px]">
      <Calendar<AdminReservationCalendarEvent>
        culture="es"
        localizer={reservationCalendarLocalizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        defaultView="month"
        onSelectEvent={openEdit}
        eventPropGetter={eventPropGetter}
        dayPropGetter={getAdminReservationDayProps}
        components={{ toolbar: AdminReservationCalendarToolbar }}
        step={30}
        timeslots={2}
        showMultiDayTimes
        longPressThreshold={300}
        popup
        popupOffset={{ x: 10, y: 10 }}
        messages={ADMIN_RESERVATION_CALENDAR_MESSAGES}
      />
    </div>
  );
}
