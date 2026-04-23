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
    | "shower";

export type GalleryHighlight = {
    id: GalleryHighlightId;
};