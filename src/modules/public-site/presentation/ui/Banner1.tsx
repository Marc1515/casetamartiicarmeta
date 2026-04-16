// src/components/public/Banner1.tsx
"use client";

import { ScrollReveal } from "@/shared/presentation/ui/scroll-reveal";
import { useTranslations } from "next-intl";

export default function Banner1() {
  const t = useTranslations("banner1");
  return (
    <section
      id="banner1"
      aria-label={t("ariaLabel")}
      className="relative w-full min-h-screen"
    >
      {/* Imagen de fondo fija a pantalla completa */}
      <div className="absolute inset-0 bg-[url('/img/sunset.png')] bg-cover bg-center bg-fixed" />

      {/* Capa que aparece al hacer scroll */}
      <ScrollReveal className="relative z-10 flex min-h-screen w-full items-center justify-center bg-black/20">
        {/* Si más adelante quieres añadir texto o un CTA, puedes ponerlo aquí */}
      </ScrollReveal>
    </section>
  );
}
