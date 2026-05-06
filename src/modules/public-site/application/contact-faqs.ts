export type ContactFaqId =
    | "capacity"
    | "bedrooms"
    | "privatePool"
    | "price"
    | "activities"
    | "terrace"
    | "checkInOut"
    | "distanceToCenter"
    | "families";

export type ContactFaq = {
    id: ContactFaqId;
    hasList?: boolean;
};

export const CONTACT_FAQS: ContactFaq[] = [
    {
        id: "capacity",
        hasList: true,
    },
    {
        id: "bedrooms",
        hasList: true,
    },
    {
        id: "privatePool",
    },
    {
        id: "price",
    },
    {
        id: "activities",
        hasList: true,
    },
    {
        id: "terrace",
    },
    {
        id: "checkInOut",
    },
    {
        id: "distanceToCenter",
    },
    {
        id: "families",
    },
];