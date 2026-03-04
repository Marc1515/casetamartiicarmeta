// src/components/public/Banner1.tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function Banner1() {
  return (
    <section
      id="banner1"
      aria-label="Jardín de la caseta"
      className="relative w-full min-h-screen"
    >
      {/* Imagen de fondo fija a pantalla completa */}
      <div className="absolute inset-0 bg-[url('/img/sunset.avif')] bg-cover bg-center bg-fixed" />

      {/* Capa que aparece al hacer scroll */}
      <ScrollReveal className="relative z-10 flex min-h-screen w-full items-center justify-center bg-black/20">
        {/* Si más adelante quieres añadir texto o un CTA, puedes ponerlo aquí */}
      </ScrollReveal>
    </section>
  );
}
