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

const MAIN_IMAGE_SWIPE_THRESHOLD_PX = 60;

const THUMBNAIL_DRAG_THRESHOLD_PX = 8;
const THUMBNAIL_INERTIA_FRICTION = 0.94;
const THUMBNAIL_MIN_VELOCITY = 0.05;
const THUMBNAIL_FRAME_DURATION_MS = 16;

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
  const thumbnailDragLastXRef = useRef<number | null>(null);
  const thumbnailDragLastTimeRef = useRef<number | null>(null);
  const thumbnailDragVelocityRef = useRef<number>(0);
  const isThumbnailDraggingRef = useRef(false);
  const hasThumbnailDraggedRef = useRef(false);
  const thumbnailInertiaFrameRef = useRef<number | null>(null);
  const pendingThumbnailIndexRef = useRef<number | null>(null);

  function handleMainImagePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
  }

  function handleMainImagePointerUp(event: PointerEvent<HTMLDivElement>) {
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
    const hasEnoughDistance = Math.abs(deltaX) >= MAIN_IMAGE_SWIPE_THRESHOLD_PX;

    if (!isHorizontalSwipe || !hasEnoughDistance) {
      return;
    }

    if (deltaX < 0) {
      onNext();
      return;
    }

    onPrev();
  }

  function resetMainImagePointer() {
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
  }

  function stopThumbnailInertia() {
    if (thumbnailInertiaFrameRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(thumbnailInertiaFrameRef.current);
    thumbnailInertiaFrameRef.current = null;
  }

  function startThumbnailInertia() {
    stopThumbnailInertia();

    function animate() {
      const stripElement = stripRef.current;

      if (!stripElement) {
        thumbnailInertiaFrameRef.current = null;
        thumbnailDragVelocityRef.current = 0;
        return;
      }

      const velocity = thumbnailDragVelocityRef.current;

      if (Math.abs(velocity) < THUMBNAIL_MIN_VELOCITY) {
        thumbnailInertiaFrameRef.current = null;
        thumbnailDragVelocityRef.current = 0;
        return;
      }

      stripElement.scrollLeft += velocity * THUMBNAIL_FRAME_DURATION_MS;
      thumbnailDragVelocityRef.current = velocity * THUMBNAIL_INERTIA_FRICTION;

      thumbnailInertiaFrameRef.current = window.requestAnimationFrame(animate);
    }

    thumbnailInertiaFrameRef.current = window.requestAnimationFrame(animate);
  }

  function getThumbnailIndexFromEvent(
    event: PointerEvent<HTMLDivElement>,
  ): number | null {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return null;
    }

    const thumbnailButton = target.closest("[data-gallery-thumbnail-index]");

    if (!(thumbnailButton instanceof HTMLButtonElement)) {
      return null;
    }

    const rawIndex = thumbnailButton.dataset.galleryThumbnailIndex;

    if (!rawIndex) {
      return null;
    }

    const parsedIndex = Number(rawIndex);

    if (!Number.isInteger(parsedIndex)) {
      return null;
    }

    return parsedIndex;
  }

  function handleThumbnailPointerDown(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;

    if (!stripElement) {
      return;
    }

    stopThumbnailInertia();

    thumbnailDragStartXRef.current = event.clientX;
    thumbnailDragLastXRef.current = event.clientX;
    thumbnailDragLastTimeRef.current = event.timeStamp;
    thumbnailDragVelocityRef.current = 0;
    isThumbnailDraggingRef.current = true;
    hasThumbnailDraggedRef.current = false;
    pendingThumbnailIndexRef.current = getThumbnailIndexFromEvent(event);

    stripElement.setPointerCapture(event.pointerId);
  }

  function handleThumbnailPointerMove(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;
    const startX = thumbnailDragStartXRef.current;
    const lastX = thumbnailDragLastXRef.current;
    const lastTime = thumbnailDragLastTimeRef.current;

    if (
      !stripElement ||
      startX === null ||
      lastX === null ||
      lastTime === null ||
      !isThumbnailDraggingRef.current
    ) {
      return;
    }

    const totalDeltaX = event.clientX - startX;
    const frameDeltaX = event.clientX - lastX;
    const frameDeltaTime = Math.max(event.timeStamp - lastTime, 1);

    if (Math.abs(totalDeltaX) >= THUMBNAIL_DRAG_THRESHOLD_PX) {
      hasThumbnailDraggedRef.current = true;
    }

    if (!hasThumbnailDraggedRef.current) {
      return;
    }

    event.preventDefault();

    const scrollDelta = -frameDeltaX;

    stripElement.scrollLeft += scrollDelta;
    thumbnailDragVelocityRef.current = scrollDelta / frameDeltaTime;

    thumbnailDragLastXRef.current = event.clientX;
    thumbnailDragLastTimeRef.current = event.timeStamp;
  }

  function handleThumbnailPointerUp(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;

    if (stripElement?.hasPointerCapture(event.pointerId)) {
      stripElement.releasePointerCapture(event.pointerId);
    }

    thumbnailDragStartXRef.current = null;
    thumbnailDragLastXRef.current = null;
    thumbnailDragLastTimeRef.current = null;
    isThumbnailDraggingRef.current = false;

    const pendingThumbnailIndex = pendingThumbnailIndexRef.current;
    pendingThumbnailIndexRef.current = null;

    if (hasThumbnailDraggedRef.current) {
      startThumbnailInertia();
      return;
    }

    if (pendingThumbnailIndex !== null) {
      onSelect(pendingThumbnailIndex);
    }
  }

  function handleThumbnailPointerCancel(event: PointerEvent<HTMLDivElement>) {
    const stripElement = stripRef.current;

    if (stripElement?.hasPointerCapture(event.pointerId)) {
      stripElement.releasePointerCapture(event.pointerId);
    }

    thumbnailDragStartXRef.current = null;
    thumbnailDragLastXRef.current = null;
    thumbnailDragLastTimeRef.current = null;
    thumbnailDragVelocityRef.current = 0;
    isThumbnailDraggingRef.current = false;
    pendingThumbnailIndexRef.current = null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden bg-background p-0">
        <DialogTitle className="sr-only">{`Galeria - Foto ${
          index + 1
        } de ${images.length}`}</DialogTitle>

        <div
          className="relative cursor-grab select-none active:cursor-grabbing"
          onPointerDown={handleMainImagePointerDown}
          onPointerUp={handleMainImagePointerUp}
          onPointerCancel={resetMainImagePointer}
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
            className="gallery-thumbnail-strip flex cursor-grab select-none gap-2 overflow-x-auto p-3 active:cursor-grabbing"
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
                  data-gallery-thumbnail-index={i}
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
