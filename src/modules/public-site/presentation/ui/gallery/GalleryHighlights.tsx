"use client";

import type { ReactNode } from "react";
import { useState } from "react";
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

const iconClassName = "h-5 w-5 shrink-0 text-[#393E46]";

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

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => onActivate(highlight.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(highlight.id)}
      onBlur={onDeactivate}
      className={[
        "min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm outline-none",
        "transition-all duration-300 ease-out",
        "focus-visible:ring-2 focus-visible:ring-[#393E46]/30",
        isExpanded ? "flex-[1.45_1_0%]" : "flex-[1_1_0%]",
        isCompressed ? "flex-[0.55_1_0%]" : "",
      ].join(" ")}
    >
      <div className="flex min-h-[76px] items-center gap-3 px-4 py-3">
        {getHighlightIcon(highlight.id)}

        <span
          className={[
            "min-w-0 text-sm font-medium text-[#393E46] transition-all duration-300 ease-out",
            isExpanded
              ? "whitespace-normal break-words"
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
    <aside aria-label={t("sectionAriaLabel")} className="grid gap-3">
      {rows.map((row) => {
        const leftIsActive = activeHighlightId === row.left.id;
        const rightIsActive =
          row.right !== null && activeHighlightId === row.right.id;

        return (
          <div key={row.left.id} className="flex gap-3">
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
              <div className="flex-[1_1_0%]" aria-hidden />
            )}
          </div>
        );
      })}
    </aside>
  );
}
