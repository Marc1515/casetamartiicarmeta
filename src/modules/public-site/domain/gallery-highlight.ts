export type GalleryHighlightId =
    | "entireHome"
    | "area"
    | "freeParking"
    | "outdoorPool"
    | "privateBathroom"
    | "airConditioning"
    | "privatePool"
    | "freeWifi"
    | "kitchen"
    | "shower"
    | "garden"
    | "terrace"
    | "barbecue"
    | "familyFriendly"
    | "natureViews";

export type GalleryHighlight = {
    id: GalleryHighlightId;
};