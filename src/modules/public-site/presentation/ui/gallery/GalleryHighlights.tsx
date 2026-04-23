"use client";

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
import type { GalleryHighlightId } from "@/modules/public-site/domain/gallery-highlight";

const iconClassName = "h-5 w-5 shrink-0 text-[#393E46]";

function getHighlightIcon(id: GalleryHighlightId): React.ReactNode {
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

export default function GalleryHighlights() {
  const t = useTranslations("gallery.highlights");
  const highlights = getGalleryHighlights();

  return (
    <aside
      aria-label={t("sectionAriaLabel")}
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1"
    >
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm"
        >
          {getHighlightIcon(highlight.id)}
          <span className="text-sm font-medium text-[#393E46]">
            {t(`${highlight.id}.label`)}
          </span>
        </div>
      ))}
    </aside>
  );
}
