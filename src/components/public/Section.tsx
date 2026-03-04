// src/components/public/Section.tsx
"use client";

import type { Ref } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type Props = {
  id: string;
  title?: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string; // color/estilo del título de sección (ej. Calendario, Galería, Contacto)
  leadClassName?: string; // color/estilo del párrafo descripción (lead)
  center?: boolean; // centra verticalmente el contenido
  bg?: React.ReactNode; // (opcional) capa de fondo full-bleed
  noPadding?: boolean; // (opcional) desactiva padding vertical
  sectionRef?: Ref<HTMLElement>; // ⬅️ ref tipado correctamente (sin any)
};

export default function Section({
  id,
  title,
  lead,
  children,
  className,
  titleClassName,
  leadClassName,
  center = false,
  bg,
  noPadding = false,
  sectionRef,
}: Props) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full min-h-screen ${
        noPadding ? "" : "pt-20 md:pt-32 pb-16"
      } ${className ?? ""}`}
    >
      {bg ? <div className="absolute inset-0 -z-10">{bg}</div> : null}

      <div
        className={`mx-auto w-full max-w-7xl px-4 ${
          center ? "flex flex-col justify-center" : ""
        }`}
      >
        {title && (
          <ScrollReveal>
            <h2 className={`text-4xl md:text-7xl font-semibold tracking-tight mb-8 ${titleClassName ?? ""}`}>
              {title}
            </h2>
          </ScrollReveal>
        )}
        {lead != null && (
          <ScrollReveal delay={0.1}>
            <p
              className={`mt-4 mb-14 pl-4 md:pl-6 border-l-4 border-[#FFD369] [text-wrap:pretty] max-w-prose whitespace-pre-line ${leadClassName ?? "text-muted-foreground"}`}
            >
              {lead}
            </p>
          </ScrollReveal>
        )}
        <ScrollReveal delay={0.2}>{children}</ScrollReveal>
      </div>
    </section>
  );
}
