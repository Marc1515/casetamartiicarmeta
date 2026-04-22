import { describe, expect, it } from "vitest";
import {
    buildLocalizedUrl,
    buildPostalAddress,
    buildVacationRentalJsonLd,
    buildWebsiteJsonLd,
} from "@/modules/seo/application/structured-data";
import {
    CONTACT,
    LOCATION,
    SITE_NAME,
    SITE_URL,
} from "@/modules/seo/application/seo";

describe("structured-data", () => {
    it("builds the localized url", () => {
        expect(buildLocalizedUrl("es")).toBe(`${SITE_URL}/es`);
    });

    it("builds the postal address", () => {
        expect(buildPostalAddress()).toEqual({
            "@type": "PostalAddress",
            streetAddress: LOCATION.streetAddress,
            addressLocality: LOCATION.locality,
            postalCode: LOCATION.postalCode,
            addressRegion: `${LOCATION.region}, ${LOCATION.province}`,
            addressCountry: LOCATION.countryCode,
        });
    });

    it("builds vacation rental json ld", () => {
        const result = buildVacationRentalJsonLd({
            locale: "es",
            structuredDescription: "Descripción estructurada",
        });

        expect(result["@type"]).toBe("VacationRental");
        expect(result.name).toBe(SITE_NAME);
        expect(result.url).toBe(`${SITE_URL}/es`);
        expect(result.description).toBe("Descripción estructurada");
        expect(result.email).toBe(CONTACT.email);
        expect(result.telephone).toBe(CONTACT.phone);
        expect(result.inLanguage).toBe("es");
    });

    it("builds website json ld", () => {
        const result = buildWebsiteJsonLd();

        expect(result).toEqual({
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
        });
    });
});