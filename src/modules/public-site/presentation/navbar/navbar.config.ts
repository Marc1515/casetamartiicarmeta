import { PUBLIC_SITE_SECTION_LINKS } from "@/modules/public-site/application/site-navigation";

export const NAVBAR_TAB_IDS = PUBLIC_SITE_SECTION_LINKS.map((link) => ({
    id: link.id,
    key: link.translationKey,
})) as readonly {
    id: (typeof PUBLIC_SITE_SECTION_LINKS)[number]["id"];
    key: (typeof PUBLIC_SITE_SECTION_LINKS)[number]["translationKey"];
}[];

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