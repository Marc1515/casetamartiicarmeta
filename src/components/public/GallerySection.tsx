// src/components/public/GallerySection.tsx
"use client";

import Section from "./Section";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import GalleryMosaicDesktop from "@/components/sections/gallery/GalleryMosaicDesktop";
import GalleryMosaicMobile from "@/components/sections/gallery/GalleryMosaicMobile";
import GalleryModal from "@/components/sections/gallery/GalleryModal";

const galleryContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const galleryItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const IMAGES = [
  "/img/house.jpg",
  "/img/house2.jpg",
  "/img/pool.jpg",
  "/img/pool2.jpg",
  "/img/terrace.jpg",
  "/img/terrace2.jpg",
  "/img/terrace3.jpg",
  "/img/garden.jpg",
  "/img/garden2.jpg",
  "/img/diningroom.jpg",
  "/img/diningroom2.jpg",
  "/img/diningroom3.jpg",
  "/img/diningroom4.jpg",
  "/img/kitchen.jpg",
  "/img/kitchen2.jpg",
  "/img/kitchen3.jpg",
  "/img/kitchen4.jpg",
  "/img/bathroom.jpg",
  "/img/bathroom2.jpg",
  "/img/doubleroom.jpg",
  "/img/doubleroom2.jpg",
  "/img/doubleroom3.jpg",
  "/img/doubleroom4.jpg",
  "/img/bedroom.jpg",
  "/img/bedroom2.jpg",
  "/img/bedroom3.jpg",
  "/img/bedroom4.jpg",
] as const;

export default function GallerySection() {
  const t = useTranslations("gallery");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number>(0); // índice de la imagen activa en el modal

  // Mosaico principal (como lo dejamos)
  const main = IMAGES[0];
  const stack = IMAGES.slice(1, 3);
  const restLine = IMAGES.slice(3, 7);

  const openModalAt = (src: string) => {
    const i = IMAGES.indexOf(src as (typeof IMAGES)[number]);
    setIndex(i >= 0 ? i : 0);
    setOpen(true);
  };

  // Helpers carrusel
  const prev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);

  // Hacer que la miniatura activa quede visible centrada
  const stripRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    activeThumbRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [index, open]);

  // Accesos rápidos con teclado
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Previene layout shift calculando tamaño de la imagen grande
  const mainSizes = useMemo(() => ({ width: 1600, height: 1200 }), []);
  const prefersReducedMotion = useReducedMotion();
  const hasReducedMotion = Boolean(prefersReducedMotion);
  const getImageKey = (src: string) =>
    src.split("/").pop()?.split(".")[0] ?? "";
  const getImageAlt = (src: string) => t(`imageAlts.${getImageKey(src)}`);

  return (
    <Section
      id="fotos"
      className="whitespace-pre-line pb-32"
      title={t("title")}
      titleClassName="text-[#393E46]"
      leadClassName="text-[#393E46]"
      lead={t("lead")}
    >
      <GalleryMosaicDesktop
        main={main}
        stack={stack}
        title={t("title")}
        prefersReducedMotion={hasReducedMotion}
        galleryContainerVariants={galleryContainerVariants}
        galleryItemVariants={galleryItemVariants}
        onOpenModalAt={openModalAt}
        getImageAlt={getImageAlt}
      />

      <GalleryMosaicMobile
        restLine={restLine}
        title={t("title")}
        prefersReducedMotion={hasReducedMotion}
        galleryContainerVariants={galleryContainerVariants}
        galleryItemVariants={galleryItemVariants}
        onOpenModalAt={openModalAt}
        getImageAlt={getImageAlt}
      />

      <GalleryModal
        open={open}
        index={index}
        images={IMAGES}
        mainSizes={mainSizes}
        stripRef={stripRef}
        activeThumbRef={activeThumbRef}
        getImageAlt={getImageAlt}
        onOpenChange={setOpen}
        onPrev={prev}
        onNext={next}
        onSelect={setIndex}
      />
    </Section>
  );
}
