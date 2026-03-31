import { routing } from "@/i18n/routing";

export const SITE_URL = "https://casetamartiicarmeta.com";
export const SITE_NAME = "Caseta Martí i Carmeta";
export const DEFAULT_LOCALE = routing.defaultLocale;
export const LOCALES = routing.locales;
export const OG_IMAGE_PATH = "/img/housebetter.png";

export const CONTACT = {
  email: "pajuanf@gmail.com",
  phone: "+34 652 75 92 94",
  phoneClean: "+34652759294",
  whatsapp: "https://wa.me/34652759294",
} as const;

export const LOCATION = {
  latitude: 40.72502884042648,
  longitude: 0.6799424640762735,
  area: "Delta de l'Ebre",
  region: "Terres de l'Ebre",
  province: "Tarragona",
  country: "Espanya",
  countryCode: "ES",
  // PENDIENTE DE CONFIRMAR: municipio exacto de la caseta.
  locality: "",
  // PENDIENTE DE CONFIRMAR: direccion exacta.
  streetAddress: "",
  // PENDIENTE DE CONFIRMAR: codigo postal.
  postalCode: "",
} as const;
