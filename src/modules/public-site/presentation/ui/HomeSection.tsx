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
import { useTranslations } from "next-intl";
import Section from "@/modules/public-site/presentation/ui/Section";

export default function HomeSection() {
  const t = useTranslations("home");
  const heroImageAlt = t("imageAlt");
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
      contentClassName="max-w-7xl"
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
              alt={heroImageAlt}
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
        {/* Bloque que se pega bajo la navbar */}
        <div className="sticky top-16 md:top-20 py-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-[#EEEEEE] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
            }
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="mt-3 text-[#EEEEEE] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    duration: 0.5,
                    delay: 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                  }
            }
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            className="mt-6 flex gap-3"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    duration: 0.5,
                    delay: 0.25,
                    ease: [0.25, 0.1, 0.25, 1],
                  }
            }
          >
            <a
              href="#calendario"
              className="rounded-md bg-white/90 px-5 py-3 font-medium text-slate-900 hover:bg-white"
            >
              {t("ctaAvailability")}
            </a>
            <a
              href="#fotos"
              className="rounded-md border border-white/70 bg-white/10 px-5 py-3 font-medium text-white hover:bg-white/15"
            >
              {t("ctaPhotos")}
            </a>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
