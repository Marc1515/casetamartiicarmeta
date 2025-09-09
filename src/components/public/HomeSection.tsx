// src/components/public/HomeSection.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Section from "@/components/public/Section";

export default function HomeSection() {
  const sectionRef = useRef<HTMLElement>(null!);
  const prefersReduced = useReducedMotion();

  // Progreso de scroll relativo a la sección
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Fondo se mueve HACIA ABAJO al hacer scroll
  const yBg = useTransform(scrollYProgress, [0, 1], ["0vh", "40vh"]);

  return (
    <Section
      id="home"
      sectionRef={sectionRef}
      noPadding
      bg={
        // 👇 El recorte del fondo va aquí (no afecta al sticky)
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Imagen de fondo con parallax */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={prefersReduced ? undefined : { y: yBg }}
          >
            <Image
              src="/img/housebetter.png"
              alt="Caseta Martí i Carmeta"
              fill
              priority
              sizes="100vw"
              className="object-cover scale-105"
            />
          </motion.div>

          {/* Scrims para legibilidad */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-[60%] bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        </div>
      }
    >
      {/* 👇 Wrapper que DEFINE el límite del sticky */}
      <div className="relative min-h-[100svh]">
        {/* Espaciador superior: cuándo empieza a pegarse */}
        <div className="h-[0vh] md:h-[0vh]" aria-hidden />

        {/* Bloque que se pega bajo la navbar (64px/80px) */}
        <div className="sticky top-16 md:top-20 py-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Caseta Martí i Carmeta
            </h1>
            <p className="mt-3 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Alojamiento acogedor para escapadas cerca del mar y la naturaleza.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#calendario"
                className="rounded-md bg-white/90 px-5 py-3 font-medium text-slate-900 hover:bg-white"
              >
                Ver disponibilidad
              </a>
              <a
                href="#fotos"
                className="rounded-md border border-white/70 bg-white/10 px-5 py-3 font-medium text-white hover:bg-white/15"
              >
                Ver fotos
              </a>
            </div>
          </div>
        </div>

        {/* Espaciador inferior: controla cuándo se “despega” */}
        <div className="h-[24vh]" aria-hidden />
      </div>
    </Section>
  );
}
