"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/presentation/ui/dialog";
import type { RefObject } from "react";

type GalleryModalProps = {
  open: boolean;
  index: number;
  images: readonly string[];
  mainSizes: { width: number; height: number };
  stripRef: RefObject<HTMLDivElement | null>;
  activeThumbRef: RefObject<HTMLButtonElement | null>;
  getImageAlt: (src: string) => string;
  onOpenChange: (value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export default function GalleryModal({
  open,
  index,
  images,
  mainSizes,
  stripRef,
  activeThumbRef,
  getImageAlt,
  onOpenChange,
  onPrev,
  onNext,
  onSelect,
}: GalleryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background p-0 overflow-hidden">
        <DialogTitle className="sr-only">{`Galeria - Foto ${
          index + 1
        } de ${images.length}`}</DialogTitle>
        <div className="relative">
          <Image
            src={images[index]}
            alt={getImageAlt(images[index])}
            width={mainSizes.width}
            height={mainSizes.height}
            className="w-full h-auto max-h-[70vh] object-contain bg-black/5"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />

          <button
            aria-label="Anterior"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/60 focus:outline-none"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/60 focus:outline-none"
          >
            ›
          </button>
        </div>

        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto p-3 border-t bg-background"
        >
          {images.map((src, i) => {
            const isActive = i === index;
            return (
              <button
                key={src}
                ref={isActive ? activeThumbRef : null}
                onClick={() => onSelect(i)}
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
                  alt={getImageAlt(src)}
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
  );
}
