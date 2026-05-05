export type PopularServiceId = "outdoorPool" | "freeParking" | "freeWifi";

export type ServiceGroupId =
    | "idealStay"
    | "parking"
    | "internet"
    | "kitchen"
    | "bedroom"
    | "bathroom"
    | "livingArea"
    | "mediaAndTechnology"
    | "roomAmenities"
    | "outdoors"
    | "outdoorPool"
    | "activities"
    | "views"
    | "buildingCharacteristics"
    | "miscellaneous"
    | "spokenLanguages";

export type ServiceItemId =
    | "parking"
    | "privateBathroom"
    | "freeParking"
    | "airConditioning"
    | "freeWifi"
    | "kitchen"
    | "terrace"
    | "flatScreenTv"
    | "washingMachine"
    | "outdoorPool"
    | "diningTable"
    | "coffeeMachine"
    | "toaster"
    | "oven"
    | "kitchenware"
    | "dishwasher"
    | "microwave"
    | "fridge"
    | "kitchenette"
    | "linen"
    | "towels"
    | "shower"
    | "diningArea"
    | "seatingArea"
    | "sofaBed"
    | "privateEntrance"
    | "iron"
    | "sunTerrace"
    | "privatePool"
    | "seasonal"
    | "bikeTours"
    | "walkingTours"
    | "cycling"
    | "hiking"
    | "fishing"
    | "poolView"
    | "gardenView"
    | "detached"
    | "noSmoking"
    | "heating"
    | "catalan"
    | "german"
    | "english"
    | "spanish"
    | "french"
    | "italian";

export type ServiceGroup = {
    id: ServiceGroupId;
    items: readonly ServiceItemId[];
    hasDescription?: boolean;
    badgeItemId?: ServiceItemId;
};

export type PopularService = {
    id: PopularServiceId;
};