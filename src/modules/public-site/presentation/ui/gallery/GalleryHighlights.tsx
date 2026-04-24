"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bath,
  Car,
  Home,
  Ruler,
  ShowerHead,
  Snowflake,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { getGalleryHighlights } from "@/modules/public-site/application/gallery-highlights";
import type {
  GalleryHighlight,
  GalleryHighlightId,
} from "@/modules/public-site/domain/gallery-highlight";

const iconClassName = "h-4 w-4 shrink-0 text-[#393E46]";

function getHighlightIcon(id: GalleryHighlightId): ReactNode {
  switch (id) {
    case "entireHome":
      return <Home className={iconClassName} aria-hidden />;
    case "area":
      return <Ruler className={iconClassName} aria-hidden />;
    case "freeParking":
      return <Car className={iconClassName} aria-hidden />;
    case "outdoorPool":
      return <Waves className={iconClassName} aria-hidden />;
    case "privateBathroom":
      return <Bath className={iconClassName} aria-hidden />;
    case "airConditioning":
      return <Snowflake className={iconClassName} aria-hidden />;
    case "privatePool":
      return <Waves className={iconClassName} aria-hidden />;
    case "freeWifi":
      return <Wifi className={iconClassName} aria-hidden />;
    case "kitchen":
      return <UtensilsCrossed className={iconClassName} aria-hidden />;
    case "shower":
      return <ShowerHead className={iconClassName} aria-hidden />;
  }
}

type HighlightRow = {
  left: GalleryHighlight;
  right: GalleryHighlight | null;
};

function buildHighlightRows(
  highlights: readonly GalleryHighlight[],
): HighlightRow[] {
  const rows: HighlightRow[] = [];

  for (let index = 0; index < highlights.length; index += 2) {
    rows.push({
      left: highlights[index],
      right: highlights[index + 1] ?? null,
    });
  }

  return rows;
}

type HighlightCardProps = {
  highlight: GalleryHighlight;
  isExpanded: boolean;
  isCompressed: boolean;
  onActivate: (highlightId: GalleryHighlightId) => void;
  onDeactivate: () => void;
};

function HighlightCard({
  highlight,
  isExpanded,
  isCompressed,
  onActivate,
  onDeactivate,
}: HighlightCardProps) {
  const t = useTranslations("gallery.highlights");

  const textRef = useRef<HTMLSpanElement | null>(null);

  const activateIfTextIsTruncated = () => {
    const textElement = textRef.current;

    if (!textElement) {
      return;
    }

    const isTextTruncated = textElement.scrollWidth > textElement.clientWidth;

    if (isTextTruncated) {
      onActivate(highlight.id);
    }
  };

  return (
    <div
      tabIndex={0}
      onMouseEnter={activateIfTextIsTruncated}
      onMouseLeave={onDeactivate}
      onFocus={activateIfTextIsTruncated}
      onBlur={onDeactivate}
      className={[
        "min-w-0 basis-0 overflow-hidden rounded-xl border border-zinc-300 bg-(#EEEEEE) shadow-sm outline-none",
        "transition-[flex-grow] duration-300 ease-out",
        "focus-visible:ring-2 focus-visible:ring-[#393E46]/30",
        isExpanded ? "grow-[1.45]" : "grow",
        isCompressed ? "grow-[0.55]" : "",
      ].join(" ")}
    >
      <div className="flex h-[68px] min-w-0 items-center gap-2 px-3 py-2">
        {getHighlightIcon(highlight.id)}

        <span
          ref={textRef}
          className={[
            "min-w-0 text-[13px] font-medium leading-tight text-[#393E46]",
            isExpanded
              ? "block overflow-hidden whitespace-normal warp-break-words"
              : "block overflow-hidden text-ellipsis whitespace-nowrap",
          ].join(" ")}
        >
          {t(`${highlight.id}.label`)}
        </span>
      </div>
    </div>
  );
}

export default function GalleryHighlights() {
  const t = useTranslations("gallery.highlights");
  const highlights = getGalleryHighlights();
  const rows = buildHighlightRows(highlights);

  const [activeHighlightId, setActiveHighlightId] =
    useState<GalleryHighlightId | null>(null);

  return (
    <aside
      aria-label={t("sectionAriaLabel")}
      className="min-w-0 max-w-full overflow-hidden"
    >
      <div className="grid gap-3">
        {rows.map((row) => {
          const leftIsActive = activeHighlightId === row.left.id;
          const rightIsActive =
            row.right !== null && activeHighlightId === row.right.id;

          return (
            <div
              key={row.left.id}
              className="flex h-[68px] min-w-0 max-w-full gap-3 overflow-hidden"
            >
              <HighlightCard
                highlight={row.left}
                isExpanded={leftIsActive}
                isCompressed={Boolean(rightIsActive)}
                onActivate={setActiveHighlightId}
                onDeactivate={() => setActiveHighlightId(null)}
              />

              {row.right ? (
                <HighlightCard
                  highlight={row.right}
                  isExpanded={Boolean(rightIsActive)}
                  isCompressed={leftIsActive}
                  onActivate={setActiveHighlightId}
                  onDeactivate={() => setActiveHighlightId(null)}
                />
              ) : (
                <div className="min-w-0 basis-0 grow" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
