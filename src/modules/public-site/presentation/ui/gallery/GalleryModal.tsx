"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/presentation/ui/dialog";
import type { PointerEvent, RefObject } from "react";
import { useRef } from "react";

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

const SWIPE_THRESHOLD_PX = 60;

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
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  const thumbnailDragStartXRef = useRef<number | null>(null);
  const thumbnailDragScrollLeftRef = useRef<number>(0);
  const isThumbnailDraggingRef = useRef(false);
  const hasThumbnailDraggedRef = useRef(false);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const startX = pointerStartXRef.current;
    const startY = pointerStartYRef.current;

    pointerStartXRef.current = null;
    pointerStartYRef.current = null;

    if (startX === null || startY === null) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const hasEnoughDistance = Math.abs(deltaX) >= SWIPE_THRESHOLD_PX;

    if (!isHorizontalSwipe || !hasEnoughDistance) {
      return;
    }

    if (deltaX < 0) {
      onNext();
      return;
    }

    onPrev();
  }

  function handleThumbnailPointerDown(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;

    if (!stripElement) {
      return;
    }

    thumbnailDragStartXRef.current = event.clientX;
    thumbnailDragScrollLeftRef.current = stripElement.scrollLeft;
    isThumbnailDraggingRef.current = true;
    hasThumbnailDraggedRef.current = false;

    stripElement.setPointerCapture(event.pointerId);
  }

  function handleThumbnailPointerMove(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;
    const startX = thumbnailDragStartXRef.current;

    if (!stripElement || startX === null || !isThumbnailDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - startX;

    if (Math.abs(deltaX) > 4) {
      hasThumbnailDraggedRef.current = true;
    }

    stripElement.scrollLeft = thumbnailDragScrollLeftRef.current - deltaX;
  }

  function handleThumbnailPointerUp(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;

    if (stripElement?.hasPointerCapture(event.pointerId)) {
      stripElement.releasePointerCapture(event.pointerId);
    }

    thumbnailDragStartXRef.current = null;
    isThumbnailDraggingRef.current = false;
  }

  function handleThumbnailPointerCancel(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;

    if (stripElement?.hasPointerCapture(event.pointerId)) {
      stripElement.releasePointerCapture(event.pointerId);
    }

    thumbnailDragStartXRef.current = null;
    isThumbnailDraggingRef.current = false;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden bg-background p-0">
        <DialogTitle className="sr-only">{`Galeria - Foto ${
          index + 1
        } de ${images.length}`}</DialogTitle>

        <div
          className="relative cursor-grab select-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStartXRef.current = null;
            pointerStartYRef.current = null;
          }}
        >
          <Image
            src={images[index]}
            alt={getImageAlt(images[index])}
            width={mainSizes.width}
            height={mainSizes.height}
            className="h-auto max-h-[70vh] w-full bg-black/5 object-contain"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
            draggable={false}
          />

          <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-full bg-black/45 px-3 py-1 text-xs text-white/90 shadow-sm backdrop-blur-sm sm:block">
            Arrastra para cambiar de foto
          </div>

          <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
            {index + 1} / {images.length}
          </div>

          <button
            type="button"
            aria-label="Anterior"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition hover:scale-110 hover:bg-black/70 focus:outline-none active:scale-95"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Siguiente"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition hover:scale-110 hover:bg-black/70 focus:outline-none active:scale-95"
          >
            ›
          </button>
        </div>

        <div className="relative overflow-hidden border-t bg-background">
          <div
            ref={stripRef}
            className="gallery-thumbnail-strip flex cursor-grab gap-2 overflow-x-auto scroll-smooth p-3 select-none active:cursor-grabbing"
            onPointerDown={handleThumbnailPointerDown}
            onPointerMove={handleThumbnailPointerMove}
            onPointerUp={handleThumbnailPointerUp}
            onPointerCancel={handleThumbnailPointerCancel}
          >
            {images.map((src, i) => {
              const isActive = i === index;

              return (
                <button
                  key={src}
                  ref={isActive ? activeThumbRef : null}
                  type="button"
                  onClick={(event) => {
                    if (hasThumbnailDraggedRef.current) {
                      event.preventDefault();
                      hasThumbnailDraggedRef.current = false;
                      return;
                    }

                    onSelect(i);
                  }}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border transition hover:scale-[1.03] active:scale-95 ${
                    isActive
                      ? "opacity-100 ring-2 ring-brand-accent"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt={getImageAlt(src)}
                    fill
                    className="object-cover"
                    sizes="96px"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
