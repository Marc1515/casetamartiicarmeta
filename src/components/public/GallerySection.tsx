// src/components/public/GallerySection.tsx
"use client";
import Section from "./Section";
import Image from "next/image";
import { useState } from "react";
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
] as const;

export default function GallerySection() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  return (
    <Section id="fotos" title="Galería">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {IMAGES.map((src) => (
          <button
            key={src}
            onClick={() => {
              setCurrent(src);
              setOpen(true);
            }}
            className="group overflow-hidden rounded-lg border"
            aria-label="Ver foto"
          >
            <Image
              src={src}
              alt="Foto del alojamiento"
              width={800}
              height={600}
              className="h-40 w-full object-cover transition-transform group-hover:scale-[1.03]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-background p-0">
          {current && (
            <Image
              src={current}
              alt="Foto ampliada"
              width={1600}
              height={1200}
              className="h-auto w-full rounded-md"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
