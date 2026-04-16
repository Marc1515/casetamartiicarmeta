"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type GalleryMosaicDesktopProps = {
  main?: string;
  stack: readonly string[];
  title: string;
  prefersReducedMotion: boolean;
  galleryContainerVariants: Variants;
  galleryItemVariants: Variants;
  onOpenModalAt: (src: string) => void;
  getImageAlt: (src: string) => string;
};

export default function GalleryMosaicDesktop({
  main,
  stack,
  title,
  prefersReducedMotion,
  galleryContainerVariants,
  galleryItemVariants,
  onOpenModalAt,
  getImageAlt,
}: GalleryMosaicDesktopProps) {
  return (
    <motion.div
      className="grid gap-3 md:grid-cols-2 md:grid-rows-2 md:aspect-[8/3]"
      variants={prefersReducedMotion ? undefined : galleryContainerVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.15 }}
    >
      {main && (
        <motion.div
          variants={prefersReducedMotion ? undefined : galleryItemVariants}
          className="md:row-span-2"
        >
          <button
            onClick={() => onOpenModalAt(main)}
            aria-label={title}
            className="group relative overflow-hidden rounded-lg border h-56 md:h-full w-full cursor-pointer"
          >
            <Image
              src={main}
              alt={getImageAlt(main)}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        </motion.div>
      )}

      {stack.map((src) => (
        <motion.div
          key={src}
          variants={prefersReducedMotion ? undefined : galleryItemVariants}
          className="hidden md:block"
        >
          <button
            onClick={() => onOpenModalAt(src)}
            aria-label={title}
            className="group relative overflow-hidden rounded-lg border h-40 md:h-full w-full cursor-pointer"
          >
            <Image
              src={src}
              alt={getImageAlt(src)}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
