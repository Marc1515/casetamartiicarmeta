"use client";

import type { ComponentType } from "react";
import type { ToolbarProps, View } from "react-big-calendar";
import { Button } from "@/shared/presentation/ui/button";
import type { AdminReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";

function getEnabledViews(
  views: ToolbarProps<AdminReservationCalendarEvent>["views"],
): View[] {
  if (Array.isArray(views)) {
    return views as View[];
  }

  const viewsMap = views as Partial<
    Record<View, boolean | ComponentType<object>>
  >;

  return (Object.keys(viewsMap) as View[]).filter((currentView) =>
    Boolean(viewsMap[currentView]),
  );
}

function getViewLabel(view: View): string {
  if (view === "month") {
    return "Mes";
  }

  if (view === "week") {
    return "Semana";
  }

  if (view === "day") {
    return "Día";
  }

  return view;
}

export default function AdminReservationCalendarToolbar(
  props: ToolbarProps<AdminReservationCalendarEvent>,
) {
  const { label, onNavigate, onView, view, views } = props;

  const viewList = getEnabledViews(views);

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
        {viewList.map((currentView) => (
          <Button
            key={currentView}
            size="sm"
            variant={view === currentView ? "default" : "outline"}
            onClick={() => onView(currentView)}
          >
            {getViewLabel(currentView)}
          </Button>
        ))}
      </div>
    </div>
  );
}
