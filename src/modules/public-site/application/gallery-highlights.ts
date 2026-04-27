import type { GalleryHighlight } from "@/modules/public-site/domain/gallery-highlight";

const GALLERY_HIGHLIGHTS: readonly GalleryHighlight[] = [
    { id: "entireHome" },
    { id: "area" },
    { id: "freeParking" },
    { id: "outdoorPool" },
    { id: "privateBathroom" },
    { id: "airConditioning" },
    { id: "privatePool" },
    { id: "freeWifi" },
    { id: "kitchen" },
    { id: "shower" },
    { id: "garden" },
    { id: "terrace" },
    { id: "barbecue" },
    { id: "familyFriendly" },
    { id: "natureViews" },
] as const;

export function getGalleryHighlights(): readonly GalleryHighlight[] {
    return GALLERY_HIGHLIGHTS;
}