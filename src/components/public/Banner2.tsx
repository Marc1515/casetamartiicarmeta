// src/components/public/Banner2.tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function Banner2() {
  return (
    <section
      id="banner2"
      aria-label="Paisaje del delta"
      className="relative w-full min-h-screen"
    >
      {/* Imagen de fondo fija a pantalla completa */}
      <div className="absolute inset-0 bg-[url('/img/deltaLandscape2.png')] bg-cover bg-center bg-fixed" />

      {/* Capa que aparece al hacer scroll */}
      <ScrollReveal className="relative z-10 flex min-h-screen w-full items-center justify-center bg-black/20">
        {/* Contenido opcional futuro */}
      </ScrollReveal>
    </section>
  );
}
