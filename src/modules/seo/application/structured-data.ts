import {
    CONTACT,
    LOCATION,
    OG_IMAGE_PATH,
    SITE_NAME,
    SITE_URL,
} from "@/modules/seo/application/seo";

type BuildStructuredDataInput = {
    locale: string;
    structuredDescription: string;
};

export function buildLocalizedUrl(locale: string): string {
    return `${SITE_URL}/${locale}`;
}

export function buildPostalAddress() {
    return {
        "@type": "PostalAddress",
        ...(LOCATION.streetAddress
            ? { streetAddress: LOCATION.streetAddress }
            : {}),
        ...(LOCATION.locality ? { addressLocality: LOCATION.locality } : {}),
        ...(LOCATION.postalCode ? { postalCode: LOCATION.postalCode } : {}),
        addressRegion: `${LOCATION.region}, ${LOCATION.province}`,
        addressCountry: LOCATION.countryCode,
    };
}

export function buildVacationRentalJsonLd({
    locale,
    structuredDescription,
}: BuildStructuredDataInput) {
    const localizedUrl = buildLocalizedUrl(locale);
    const address = buildPostalAddress();

    return {
        "@context": "https://schema.org",
        "@type": "VacationRental",
        "@id": `${localizedUrl}#vacation-rental`,
        name: SITE_NAME,
        description: structuredDescription,
        url: localizedUrl,
        image: [`${SITE_URL}${OG_IMAGE_PATH}`],
        telephone: CONTACT.phone,
        email: CONTACT.email,
        inLanguage: locale,
        address,
        geo: {
            "@type": "GeoCoordinates",
            latitude: LOCATION.latitude,
            longitude: LOCATION.longitude,
        },
        areaServed: [LOCATION.area, LOCATION.region],
        containsPlace: {
            "@type": "Accommodation",
            name: SITE_NAME,
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: CONTACT.phone,
            email: CONTACT.email,
            availableLanguage: ["ca", "es", "en", "fr", "de"],
        },
    };
}

export function buildWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["ca", "es", "en", "fr", "de"],
        publisher: {
            "@type": "Organization",
            "@id": `${SITE_URL}#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            email: CONTACT.email,
            telephone: CONTACT.phone,
        },
    };
}