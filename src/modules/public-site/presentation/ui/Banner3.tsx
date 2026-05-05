// src/components/public/Banner3.tsx
"use client";

import { ScrollReveal } from "@/shared/presentation/ui/scroll-reveal";
import { useTranslations } from "next-intl";

export default function Banner3() {
  const t = useTranslations("banner3");

  return (
    <section
      id="banner3"
      aria-label={t("ariaLabel")}
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
