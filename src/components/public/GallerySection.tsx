// src/components/public/GallerySection.tsx
"use client";

import Section from "./Section";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number>(0); // índice de la imagen activa en el modal

  // Mosaico principal (como lo dejamos)
  const main = IMAGES[0];
  const stack = IMAGES.slice(1, 4);
  const restLine = IMAGES.slice(4, 8);

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

  return (
    <Section id="fotos" title="Galería">
      {/* Mosaico principal */}
      <div className="grid gap-3 md:grid-cols-2 md:grid-rows-3 md:aspect-[16/9]">
        {/* Izquierda grande */}
        {main && (
          <button
            onClick={() => openModalAt(main)}
            aria-label="Ver foto"
            className="group relative overflow-hidden rounded-lg border md:row-span-3 h-56 md:h-auto"
          >
            <Image
              src={main}
              alt="Foto del alojamiento"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        )}

        {/* Derecha 3 apiladas */}
        {stack.map((src) => (
          <button
            key={src}
            onClick={() => openModalAt(src)}
            aria-label="Ver foto"
            className="group relative overflow-hidden rounded-lg border h-40 md:h-auto"
          >
            <Image
              src={src}
              alt="Foto del alojamiento"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {/* Línea extra de 4 imágenes */}
      {restLine.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {restLine.map((src) => (
            <button
              key={src}
              onClick={() => openModalAt(src)}
              aria-label="Ver foto"
              className="group relative overflow-hidden rounded-lg border aspect-[4/3]"
            >
              <Image
                src={src}
                alt="Foto del alojamiento"
                fill
                loading="lazy"
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal con carrusel */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-background p-0 overflow-hidden">
          <div className="relative">
            {/* Imagen grande */}
            <Image
              src={IMAGES[index]}
              alt={`Foto ${index + 1} de ${IMAGES.length}`}
              width={mainSizes.width}
              height={mainSizes.height}
              className="w-full h-auto max-h-[70vh] object-contain bg-black/5"
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />

            {/* Flechas */}
            <button
              aria-label="Anterior"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/60 focus:outline-none"
            >
              ‹
            </button>
            <button
              aria-label="Siguiente"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/60 focus:outline-none"
            >
              ›
            </button>
          </div>

          {/* Tira de miniaturas (carrusel) */}
          <div
            ref={stripRef}
            className="flex gap-2 overflow-x-auto p-3 border-t bg-background"
          >
            {IMAGES.map((src, i) => {
              const isActive = i === index;
              return (
                <button
                  key={src}
                  ref={isActive ? activeThumbRef : null}
                  onClick={() => setIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border transition
                    ${
                      isActive
                        ? "ring-2 ring-blue-500"
                        : "opacity-80 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={src}
                    alt={`Miniatura ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
