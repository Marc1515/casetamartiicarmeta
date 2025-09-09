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
      className={`relative w-full scroll-mt-20 min-h-screen ${
        noPadding ? "" : "py-16 md:py-24"
      } ${className ?? ""}`}
    >
      {bg ? <div className="absolute inset-0 -z-10">{bg}</div> : null}

      <div
        className={`mx-auto w-full max-w-5xl px-4 ${
          center ? "flex flex-col justify-center" : ""
        }`}
      >
        {title && (
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">
            {title}
          </h2>
        )}
        {lead && <p className="mb-6 text-muted-foreground">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
