"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type GalleryMosaicMobileProps = {
  restLine: readonly string[];
  title: string;
  prefersReducedMotion: boolean;
  galleryContainerVariants: Variants;
  galleryItemVariants: Variants;
  onOpenModalAt: (src: string) => void;
  getImageAlt: (src: string) => string;
};

export default function GalleryMosaicMobile({
  restLine,
  title,
  prefersReducedMotion,
  galleryContainerVariants,
  galleryItemVariants,
  onOpenModalAt,
  getImageAlt,
}: GalleryMosaicMobileProps) {
  if (restLine.length === 0) return null;

  return (
    <motion.div
      className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
      variants={prefersReducedMotion ? undefined : galleryContainerVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.15 }}
    >
      {restLine.map((src) => (
        <motion.div
          key={src}
          variants={prefersReducedMotion ? undefined : galleryItemVariants}
        >
          <button
            onClick={() => onOpenModalAt(src)}
            aria-label={title}
            className="group relative overflow-hidden rounded-lg border aspect-[4/3] w-full cursor-pointer"
          >
            <Image
              src={src}
              alt={getImageAlt(src)}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
