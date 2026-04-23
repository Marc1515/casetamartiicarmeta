// src/components/public/GallerySection.tsx
"use client";

import Section from "./Section";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import GalleryMosaicDesktop from "@/modules/public-site/presentation/ui/gallery/GalleryMosaicDesktop";
import GalleryMosaicMobile from "@/modules/public-site/presentation/ui/gallery/GalleryMosaicMobile";
import GalleryModal from "@/modules/public-site/presentation/ui/gallery/GalleryModal";
import GalleryHighlights from "@/modules/public-site/presentation/ui/gallery/GalleryHighlights";

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
  const [index, setIndex] = useState<number>(0);

  const main = IMAGES[0];
  const stack = IMAGES.slice(1, 3);
  const restLine = IMAGES.slice(3, 7);

  const openModalAt = (src: string) => {
    const i = IMAGES.indexOf(src as (typeof IMAGES)[number]);
    setIndex(i >= 0 ? i : 0);
    setOpen(true);
  };

  const prev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);

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

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
      titleClassName="text-3xl md:text-5xl text-[#393E46]"
      leadClassName="text-sm md:text-base text-[#393E46]"
      lead={t("lead")}
    >
      <div className="grid gap-6 overflow-x-clip xl:grid-cols-3 xl:items-start">
        <div className="min-w-0 space-y-3 xl:col-span-2">
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
        </div>

        <div className="min-w-0 xl:col-span-1">
          <GalleryHighlights />
        </div>
      </div>

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
