import { CONTACT, LOCATION } from "@/modules/seo/application/seo";

const OSM_DELTA_LNG = 0.006;
const OSM_DELTA_LAT = 0.004;

export function getContactSectionEmail(): string {
    return CONTACT.email;
}

export function getContactSectionPhone(): string {
    return CONTACT.phone;
}

export function getContactSectionPhoneHref(): string {
    return `tel:${CONTACT.phone.replace(/\s+/g, "")}`;
}

export function getContactSectionWhatsappHref(): string {
    return `${CONTACT.whatsapp}?text=${encodeURIComponent(
        "Hola, me interesa la caseta",
    )}`;
}

export function getContactSectionDirectionsHref(): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.latitude},${LOCATION.longitude}`;
}

export function getContactSectionGmailComposeHref(): string {
    const subject = "Reserva caseta";
    const body = "Hola, me interesa la caseta. Fechas: ____  Personas: ____";

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        CONTACT.email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildOsmEmbedSrc(): string {
    const minLng = LOCATION.longitude - OSM_DELTA_LNG;
    const minLat = LOCATION.latitude - OSM_DELTA_LAT;
    const maxLng = LOCATION.longitude + OSM_DELTA_LNG;
    const maxLat = LOCATION.latitude + OSM_DELTA_LAT;

    const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
        bbox,
    )}&layer=mapnik&marker=${LOCATION.latitude},${LOCATION.longitude}`;
}

function getGoogleEmbedZoom(): string {
    const raw = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_ZOOM?.trim();

    if (!raw) {
        return "15";
    }

    const parsed = Number.parseInt(raw, 10);

    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 21) {
        return "15";
    }

    return String(parsed);
}

export function getContactSectionMapEmbedSrc(locale: string): string {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

    if (apiKey) {
        const language = locale.split("-")[0] || "es";
        const query = `${LOCATION.latitude},${LOCATION.longitude}`;

        const params = new URLSearchParams({
            key: apiKey,
            q: query,
            zoom: getGoogleEmbedZoom(),
            language,
            maptype: "satellite",
        });

        return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
    }

    const fromShare = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC?.trim();

    if (fromShare) {
        return fromShare;
    }

    return buildOsmEmbedSrc();
}