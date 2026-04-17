"use client";
import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/shared/presentation/ui/button";
import { getAdminReservations } from "@/modules/reservations/presentation/api/reservations.client";
import {
  emitAdminReservationEdit,
  onAdminReservationHighlight,
  onAdminReservationsChanged,
} from "@/modules/reservations/presentation/events/reservation-admin.events";

// 6 azules con texto adecuado (buen contraste)
const PALETTE: Array<{ bg: string; text: string }> = [
  { bg: "#023e8a", text: "#ffffff" },
  { bg: "#0077b6", text: "#ffffff" },
  { bg: "#0096c7", text: "#ffffff" },
  { bg: "#00b4d8", text: "#ffffff" },
  { bg: "#48cae4", text: "#ffffff" },
  { bg: "#90e0ef", text: "#ffffff" },
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

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

const ToolbarComp = (props: ToolbarProps<Evt>) => {
  const { label, onNavigate, onView, view, views } = props;

  let viewList: View[];
  if (Array.isArray(views)) {
    viewList = views as View[];
  } else {
    const obj = views as Partial<
      Record<View, boolean | React.ComponentType<unknown>>
    >;
    viewList = (Object.keys(obj) as View[]).filter((v) => Boolean(obj[v]));
  }

  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <div className="inline-flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>
          Hoy
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("PREV")}>
          Atrás
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("NEXT")}>
          Siguiente
        </Button>
      </div>

      <div className="text-sm font-semibold">{label}</div>

      <div className="inline-flex items-center gap-2">
        {viewList.map((v) => (
          <Button
            key={v}
            size="sm"
            variant={view === v ? "default" : "outline"}
            onClick={() => onView(v)}
          >
            {v === "month"
              ? "Mes"
              : v === "week"
                ? "Semana"
                : v === "day"
                  ? "Día"
                  : v}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default function CalendarAdmin() {
  const [events, setEvents] = useState<Evt[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  async function load() {
    const result = await getAdminReservations();

    if (!result.ok) {
      return;
    }

    setEvents(
      result.data.map((reservation) => ({
        id: reservation.id,
        title: reservation.title,
        start: new Date(reservation.start),
        end: new Date(reservation.end),
        allDay: reservation.allDay ?? false,
        notes: reservation.notes ?? null,
      })),
    );
  }

  useEffect(() => {
    void load();

    const unsubscribeReload = onAdminReservationsChanged(() => {
      void load();
    });

    const unsubscribeHighlight = onAdminReservationHighlight(({ id }) => {
      setHighlightedId(id);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedId((currentId) => (currentId === id ? null : currentId));
        highlightTimeoutRef.current = null;
      }, 4000);
    });

    return () => {
      unsubscribeReload();
      unsubscribeHighlight();

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
    };
  }, []);

  function openEdit(event: Evt) {
    emitAdminReservationEdit(event);
  }

  function eventPropGetter(
    event: Evt,
    _start?: Date,
    _end?: Date,
    isSelected?: boolean,
  ) {
    if (event.id === highlightedId) {
      return {
        style: {
          outline: "3px solid #f59e0b",
          backgroundColor: "#fff7ed",
          color: "#7c2d12",
          boxShadow: "0 0 0 2px rgba(245,158,11,.25) inset",
        },
      };
    }

    const idx = hashString(`${event.id}|${event.title}`) % PALETTE.length;
    const color = PALETTE[idx];

    const style: React.CSSProperties = {
      backgroundColor: color.bg,
      borderColor: color.bg,
      color: color.text,
    };

    const duration = event.end.getTime() - event.start.getTime();
    if (duration >= 2 * 24 * 60 * 60 * 1000) {
      style.filter = "brightness(0.95)";
    }

    if (isSelected) {
      style.boxShadow = "0 0 0 2px rgba(255,255,255,0.25) inset";
    }

    return { style };
  }

  function dayPropGetter(date: Date) {
    const isWeekend = [0, 6].includes(getDay(date));
    return isWeekend ? { className: "rbc-weekend" } : {};
  }

  return (
    <div className="admin-calendar h-[320px] sm:h-[600px] lg:h-[650px] [@media(max-height:500px)]:h-[340px] [@media(max-height:420px)]:h-[280px]">
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
        dayPropGetter={dayPropGetter}
        components={{ toolbar: ToolbarComp }}
        step={30}
        timeslots={2}
        showMultiDayTimes
        longPressThreshold={300}
        popup
        popupOffset={{ x: 10, y: 10 }}
        messages={{
          month: "Mes",
          week: "Semana",
          day: "Día",
          today: "Hoy",
          previous: "Atrás",
          next: "Siguiente",
          showMore: (total) => `+ Ver ${total} más`,
        }}
      />
    </div>
  );
}
