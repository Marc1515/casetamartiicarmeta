export const NAVBAR_TAB_IDS = [
    { id: "home", key: "home" },
    { id: "calendario", key: "calendario" },
    { id: "fotos", key: "fotos" },
    { id: "contacto", key: "contacto" },
] as const;

export const NAVBAR_LOCALES = [
    { locale: "ca", label: "Català" },
    { locale: "es", label: "Castellano" },
    { locale: "en", label: "English" },
    { locale: "fr", label: "Français" },
    { locale: "de", label: "Deutsch" },
] as const;

export type NavbarTab = (typeof NAVBAR_TAB_IDS)[number];
export type NavbarLocale = (typeof NAVBAR_LOCALES)[number]["locale"];
export type NavbarLocaleOption = (typeof NAVBAR_LOCALES)[number];