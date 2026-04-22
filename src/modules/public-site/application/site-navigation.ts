export const PUBLIC_SITE_SECTION_LINKS = [
    { id: "home", href: "#home", translationKey: "home" },
    { id: "calendario", href: "#calendario", translationKey: "calendario" },
    { id: "fotos", href: "#fotos", translationKey: "fotos" },
    { id: "contacto", href: "#contacto", translationKey: "contacto" },
] as const;

export type PublicSiteSectionLink = (typeof PUBLIC_SITE_SECTION_LINKS)[number];