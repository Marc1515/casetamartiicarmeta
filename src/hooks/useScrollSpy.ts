"use client";

import { useEffect, useState } from "react";

type Options = {
  /** Ej. "-20% 0px -60% 0px" para activar antes de que el título toque el top */
  rootMargin?: string;
  /** Umbrales a vigilar; varios valores funcionan mejor con secciones altas */
  threshold?: number | number[];
};

/**
 * Observa secciones por id y devuelve el id actualmente “activo” al hacer scroll.
 * Usa IntersectionObserver, con un pequeño fallback por si ninguna sección interseca.
 */
export function useScrollSpy(ids: string[], opts: Options = {}) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
          return;
        }

        // Fallback: si ninguna interseca, elegimos la más cercana al top
        const byTop = sections
          .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
          .sort((a, b) => Math.abs(a.top) - Math.abs(b.top))[0];
        if (byTop?.id) setActiveId(byTop.id);
      },
      {
        rootMargin: opts.rootMargin ?? "-20% 0px -60% 0px",
        threshold: opts.threshold ?? [0.25, 0.5, 0.75],
      }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(","), opts.rootMargin, JSON.stringify(opts.threshold)]);

  // Recalcula en resize para evitar desincronizar al cambiar layout
  useEffect(() => {
    const onResize = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];
      if (!sections.length) return;
      const byTop = sections
        .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
        .sort((a, b) => Math.abs(a.top) - Math.abs(b.top))[0];
      if (byTop?.id) setActiveId(byTop.id);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ids]);

  return activeId;
}
