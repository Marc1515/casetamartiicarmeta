"use client";

import { useEffect, useState } from "react";

type CalendarInfoSyncedAsideProps = {
  children: React.ReactNode;
};

type SyncedMetrics = {
  offsetTop: number;
  height: number;
};

export default function CalendarInfoSyncedAside({
  children,
}: CalendarInfoSyncedAsideProps) {
  const [metrics, setMetrics] = useState<SyncedMetrics | null>(null);

  useEffect(() => {
    let monthViewObserver: ResizeObserver | null = null;
    let calendarObserver: ResizeObserver | null = null;
    let rafId = 0;
    const desktopQuery = window.matchMedia("(min-width: 1280px)");

    const computeMetrics = (
      monthView: HTMLElement,
      calendarRoot: HTMLElement,
    ) => {
      if (!desktopQuery.matches) {
        setMetrics(null);
        return;
      }

      const monthRect = monthView.getBoundingClientRect();
      const calendarRect = calendarRoot.getBoundingClientRect();

      setMetrics({
        offsetTop: Math.round(monthRect.top - calendarRect.top),
        height: Math.round(monthRect.height),
      });
    };

    const connect = () => {
      const calendarRoot = document.querySelector<HTMLElement>(
        ".public-calendar",
      );
      const monthView = calendarRoot?.querySelector<HTMLElement>(
        ".rbc-month-view",
      );

      if (!calendarRoot || !monthView) {
        rafId = window.requestAnimationFrame(connect);
        return;
      }

      computeMetrics(monthView, calendarRoot);

      monthViewObserver = new ResizeObserver(() =>
        computeMetrics(monthView, calendarRoot),
      );
      monthViewObserver.observe(monthView);

      calendarObserver = new ResizeObserver(() =>
        computeMetrics(monthView, calendarRoot),
      );
      calendarObserver.observe(calendarRoot);
    };

    const onBreakpointChange = () => {
      const calendarRoot = document.querySelector<HTMLElement>(
        ".public-calendar",
      );
      const monthView = calendarRoot?.querySelector<HTMLElement>(
        ".rbc-month-view",
      );

      if (calendarRoot && monthView) {
        computeMetrics(monthView, calendarRoot);
      } else if (!desktopQuery.matches) {
        setMetrics(null);
      }
    };

    connect();
    desktopQuery.addEventListener("change", onBreakpointChange);
    window.addEventListener("resize", onBreakpointChange);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      monthViewObserver?.disconnect();
      calendarObserver?.disconnect();
      desktopQuery.removeEventListener("change", onBreakpointChange);
      window.removeEventListener("resize", onBreakpointChange);
    };
  }, []);

  const style = metrics
    ? {
        paddingTop: `${metrics.offsetTop}px`,
        height: `${metrics.offsetTop + metrics.height}px`,
      }
    : undefined;

  return (
    <aside className="xl:flex xl:flex-col" style={style}>
      {children}
    </aside>
  );
}
