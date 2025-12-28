// src/components/public/Section.tsx
import type { Ref } from "react";

type Props = {
  id: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
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
        noPadding ? "" : "pt-24 md:pt-48"
      } ${className ?? ""}`}
    >
      {bg ? <div className="absolute inset-0 -z-10">{bg}</div> : null}

      <div
        className={`mx-auto w-full max-w-7xl px-4 ${
          center ? "flex flex-col justify-center" : ""
        }`}
      >
        {title && (
          <h2 className="mb-2 pb-24 text-4xl md:text-7xl font-semibold tracking-tight">
            {title}
          </h2>
        )}
        {lead && (
          <p
            className="
              mb-18 text-muted-foreground
              pl-4 md:pl-6
              border-l-4 border-primary/60
              [text-wrap:pretty] max-w-prose
            "
          >
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
