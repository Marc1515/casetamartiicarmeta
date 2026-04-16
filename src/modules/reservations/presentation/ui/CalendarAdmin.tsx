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

// 6 azules con texto adecuado (buen contraste)
const PALETTE: Array<{ bg: string; text: string }> = [
  { bg: "#023e8a", text: "#ffffff" }, // blue-900
  { bg: "#0077b6", text: "#ffffff" }, // blue-700
  { bg: "#0096c7", text: "#ffffff" }, // blue-600
  { bg: "#00b4d8", text: "#ffffff" }, // blue-500 -> texto oscuro
  { bg: "#48cae4", text: "#ffffff" }, // blue-400 -> texto oscuro
  { bg: "#90e0ef", text: "#ffffff" }, // blue-800
];

// hash simple y estable por id/título (para repartir colores)
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

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

// ✅ Toolbar tipada (sin generics raros) y normalización de views sin `any`
const ToolbarComp = (props: ToolbarProps<Evt>) => {
  const { label, onNavigate, onView, view, views } = props;

  // Normaliza `views` a array de View
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
      })),
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
      }, 4000);
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

  function eventPropGetter(
    event: Evt,
    _start?: Date,
    _end?: Date,
    isSelected?: boolean,
  ) {
    // 🎯 override de highlight (tuyo)
    if (event.id === highlightedId) {
      return {
        style: {
          outline: "3px solid #f59e0b",
          backgroundColor: "#fff7ed",
          color: "#7c2d12", // texto ambar oscuro para contraste
          boxShadow: "0 0 0 2px rgba(245,158,11,.25) inset",
        },
      };
    }

    // color consistente por evento (id + título)
    const idx = hashString(`${event.id}|${event.title}`) % PALETTE.length;
    const c = PALETTE[idx];

    const style: React.CSSProperties = {
      backgroundColor: c.bg,
      borderColor: c.bg,
      color: c.text,
    };

    // si es un evento largo (+2 días), baja un poco el brillo
    const dur = event.end.getTime() - event.start.getTime();
    if (dur >= 2 * 24 * 60 * 60 * 1000) {
      style.filter = "brightness(0.95)";
    }

    // seleccionado por RBC → sutil énfasis
    if (isSelected) {
      style.boxShadow = "0 0 0 2px rgba(255,255,255,0.25) inset";
    }

    return { style };
  }

  function dayPropGetter(date: Date) {
    const isWeekend = [0, 6].includes(getDay(date)); // dom/sáb
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
        step={30} // 30 min por “paso”
        timeslots={2} // 2 slots por hora (2 x 30 = 60)
        showMultiDayTimes // muestra horas en eventos que cruzan días
        longPressThreshold={300} // touch: mantener 300ms
        popup
        popupOffset={{ x: 10, y: 10 }}
        messages={{
          month: "Mes",
          week: "Semana",
          day: "Día",
          today: "Hoy",
          previous: "Atrás",
          next: "Siguiente",
          showMore: (total) => `+${total} más`,
        }}
      />
      <p className="mt-2 text-sm text-gray-600 [@media(max-height:500px)]:hidden">
        Haz clic en un evento para editarlo.
      </p>
    </div>
  );
}
