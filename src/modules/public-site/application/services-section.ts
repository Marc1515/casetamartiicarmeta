import type {
    PopularService,
    ServiceGroup,
} from "@/modules/public-site/domain/service";

const POPULAR_SERVICES: readonly PopularService[] = [
    { id: "outdoorPool" },
    { id: "freeParking" },
    { id: "freeWifi" },
] as const;

const SERVICE_GROUPS: readonly ServiceGroup[] = [
    {
        id: "idealStay",
        items: [
            "parking",
            "privateBathroom",
            "freeParking",
            "airConditioning",
            "freeWifi",
            "kitchen",
            "terrace",
            "flatScreenTv",
            "washingMachine",
            "outdoorPool",
        ],
    },
    {
        id: "parking",
        hasDescription: true,
        items: [],
    },
    {
        id: "internet",
        hasDescription: true,
        items: [],
    },
    {
        id: "kitchen",
        items: [
            "diningTable",
            "coffeeMachine",
            "toaster",
            "oven",
            "kitchenware",
            "kitchen",
            "washingMachine",
            "dishwasher",
            "microwave",
            "fridge",
            "kitchenette",
        ],
    },
    {
        id: "bedroom",
        items: ["linen"],
    },
    {
        id: "bathroom",
        items: ["towels", "privateBathroom", "shower"],
    },
    {
        id: "livingArea",
        items: ["diningArea", "seatingArea"],
    },
    {
        id: "mediaAndTechnology",
        items: ["flatScreenTv"],
    },
    {
        id: "roomAmenities",
        items: ["sofaBed", "privateEntrance", "iron"],
    },
    {
        id: "outdoors",
        items: ["sunTerrace", "privatePool", "terrace"],
    },
    {
        id: "outdoorPool",
        items: ["seasonal"],
        badgeItemId: "seasonal",
    },
    {
        id: "activities",
        items: ["bikeTours", "walkingTours", "cycling", "hiking", "fishing"],
    },
    {
        id: "views",
        items: ["poolView", "gardenView"],
    },
    {
        id: "buildingCharacteristics",
        items: ["detached"],
    },
    {
        id: "miscellaneous",
        items: ["airConditioning", "noSmoking", "heating"],
    },
    {
        id: "spokenLanguages",
        items: ["catalan", "german", "english", "spanish", "french", "italian"],
    },
] as const;

export function getPopularServices(): readonly PopularService[] {
    return POPULAR_SERVICES;
}

export function getServiceGroups(): readonly ServiceGroup[] {
    return SERVICE_GROUPS;
}