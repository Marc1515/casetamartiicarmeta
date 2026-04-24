"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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
  Baby,
  Flower2,
  TreePine,
  Utensils,
  Mountain,
} from "lucide-react";
import { getGalleryHighlights } from "@/modules/public-site/application/gallery-highlights";
import type {
  GalleryHighlight,
  GalleryHighlightId,
} from "@/modules/public-site/domain/gallery-highlight";

const iconClassName = "h-6 w-6 shrink-0 text-[#393E46]";

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
    case "garden":
      return <TreePine className={iconClassName} aria-hidden />;
    case "terrace":
      return <Flower2 className={iconClassName} aria-hidden />;
    case "barbecue":
      return <Utensils className={iconClassName} aria-hidden />;
    case "familyFriendly":
      return <Baby className={iconClassName} aria-hidden />;
    case "natureViews":
      return <Mountain className={iconClassName} aria-hidden />;
  }
}

type HighlightRow = {
  items: readonly GalleryHighlight[];
};

function buildHighlightRows(
  highlights: readonly GalleryHighlight[],
): HighlightRow[] {
  const rows: HighlightRow[] = [];

  for (let index = 0; index < highlights.length; index += 3) {
    rows.push({
      items: highlights.slice(index, index + 3),
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

  const [showExpandedText, setShowExpandedText] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    if (!isExpanded) {
      setShowExpandedText(false);
      setShowIcon(true);
      return;
    }

    setShowIcon(false);

    const timeoutId = window.setTimeout(() => {
      setShowExpandedText(true);
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [isExpanded]);

  return (
    <div
      tabIndex={0}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          onActivate(highlight.id);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          onDeactivate();
        }
      }}
      onClick={() => {
        if (isExpanded) {
          onDeactivate();
          return;
        }

        onActivate(highlight.id);
      }}
      onFocus={() => onActivate(highlight.id)}
      onBlur={onDeactivate}
      className={[
        "min-w-0 basis-0 overflow-hidden rounded-xl border border-zinc-300 bg-[#EEEEEE] shadow-sm outline-none",
        "transition-[flex-grow] duration-300 ease-out",
        "focus-visible:ring-2 focus-visible:ring-[#393E46]/30",
        isExpanded ? "grow-[1.45]" : "grow",
        isCompressed ? "grow-[0.55]" : "",
      ].join(" ")}
    >
      <div className="relative flex h-[68px] min-w-0 items-center justify-center px-3 py-2">
        <div
          className={[
            "absolute inset-0 flex items-center justify-center",
            "transition-opacity duration-150 ease-out",
            showIcon ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {getHighlightIcon(highlight.id)}
        </div>

        <span
          className={[
            "min-w-0 px-2 text-center text-[13px] font-medium leading-tight text-[#393E46]",
            "transition-opacity duration-150 ease-out",
            showExpandedText ? "opacity-100" : "opacity-0",
            showExpandedText
              ? "block overflow-hidden whitespace-normal break-words"
              : "block overflow-hidden whitespace-nowrap",
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
        {rows.map((row) => (
          <div
            key={row.items.map((item) => item.id).join("-")}
            className="flex h-[68px] min-w-0 max-w-full gap-3 overflow-hidden"
          >
            {row.items.map((highlight) => {
              const isExpanded = activeHighlightId === highlight.id;

              const isCompressed =
                activeHighlightId !== null &&
                row.items.some((item) => item.id === activeHighlightId) &&
                !isExpanded;

              return (
                <HighlightCard
                  key={highlight.id}
                  highlight={highlight}
                  isExpanded={isExpanded}
                  isCompressed={isCompressed}
                  onActivate={setActiveHighlightId}
                  onDeactivate={() => setActiveHighlightId(null)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
