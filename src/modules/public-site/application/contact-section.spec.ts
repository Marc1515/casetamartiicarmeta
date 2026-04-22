import { afterEach, describe, expect, it } from "vitest";
import {
    getContactSectionDirectionsHref,
    getContactSectionEmail,
    getContactSectionGmailComposeHref,
    getContactSectionMapEmbedSrc,
    getContactSectionPhone,
    getContactSectionPhoneHref,
    getContactSectionWhatsappHref,
} from "@/modules/public-site/application/contact-section";
import { CONTACT, LOCATION } from "@/modules/seo/application/seo";

describe("contact-section application helpers", () => {
    afterEach(() => {
        delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
        delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_ZOOM;
        delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC;
    });

    it("returns shared contact email", () => {
        expect(getContactSectionEmail()).toBe(CONTACT.email);
    });

    it("returns shared contact phone", () => {
        expect(getContactSectionPhone()).toBe(CONTACT.phone);
    });

    it("builds phone href", () => {
        expect(getContactSectionPhoneHref()).toBe(`tel:${CONTACT.phoneClean}`);
    });

    it("builds whatsapp href", () => {
        expect(getContactSectionWhatsappHref()).toContain(CONTACT.whatsapp);
    });

    it("builds directions href from location coordinates", () => {
        expect(getContactSectionDirectionsHref()).toBe(
            `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.latitude},${LOCATION.longitude}`,
        );
    });

    it("builds gmail compose href", () => {
        const result = getContactSectionGmailComposeHref();

        expect(result).toContain("https://mail.google.com/mail/?view=cm&fs=1");
        expect(result).toContain(encodeURIComponent(CONTACT.email));
    });

    it("returns google embed src when api key exists", () => {
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = "test-key";
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_ZOOM = "14";

        const result = getContactSectionMapEmbedSrc("es");

        expect(result).toContain("https://www.google.com/maps/embed/v1/place?");
        expect(result).toContain("key=test-key");
        expect(result).toContain("zoom=14");
        expect(result).toContain("language=es");
    });

    it("returns shared embed src when provided", () => {
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC =
            "https://maps.example.com/embed";

        const result = getContactSectionMapEmbedSrc("es");

        expect(result).toBe("https://maps.example.com/embed");
    });

    it("falls back to openstreetmap embed src", () => {
        const result = getContactSectionMapEmbedSrc("es");

        expect(result).toContain("https://www.openstreetmap.org/export/embed.html");
        expect(result).toContain(`marker=${LOCATION.latitude},${LOCATION.longitude}`);
    });
});