"use client";

import Section from "./Section";
import { Icon } from "@iconify/react";
import { Phone, Mail } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

// Coordenadas de la caseta (ejemplo). Cambia por las reales.
const LAT = 40.72502884042648;
const LNG = 0.6799424640762735;

// Enlace a “Cómo llegar” (abre Google Maps con destino)
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

// Mapa incrustado: Google con `?q=...&output=embed` no es el embed oficial y en WebViews (p. ej. Instagram)
// suele fallar con net::ERR_BLOCKED_BY_RESPONSE. OpenStreetMap sí permite iframe de forma fiable.
const OSM_DELTA_LNG = 0.006;
const OSM_DELTA_LAT = 0.004;
const osmEmbedSrc = (() => {
  const minLng = LNG - OSM_DELTA_LNG;
  const minLat = LAT - OSM_DELTA_LAT;
  const maxLng = LNG + OSM_DELTA_LNG;
  const maxLat = LAT + OSM_DELTA_LAT;
  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${LAT},${LNG}`;
})();

export default function ContactSection() {
  const t = useTranslations("contact");
  const email = "pajuanf@gmail.com";
  const phone = "+34 652 75 92 94";
  const whatsapp =
    "https://wa.me/34652759294?text=Hola%2C%20me%20interesa%20la%20caseta";

  // arriba del componente, puedes preparar la URL:
  const subject = "Reserva caseta";
  const body = "Hola, me interesa la caseta. Fechas: ____  Personas: ____";
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <Section
      id="contacto"
      className="whitespace-pre-line"
      title={t("title")}
      titleClassName="text-[#393E46]"
      leadClassName="text-[#393E46]"
      lead={t("lead")}
      center
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Datos de contacto */}
        <ScrollReveal>
          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" aria-hidden />
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hover:underline underline-offset-2"
              >
                {phone}
              </a>
            </p>

            <p className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" aria-hidden />
              <a
                href={`mailto:${email}`}
                className="hover:underline underline-offset-2"
              >
                {email}
              </a>
            </p>

            <p className="text-muted-foreground py-3">
              {t("hint")}
            </p>
            <div className="mt-3 flex flex-wrap gap-6 pb-3">
              <Button
                asChild
                size="icon"
                className="rounded-md overflow-hidden [&_svg]:h-full [&_svg]:w-full"
                title={t("emailLabel")}
                aria-label={t("emailLabel")}
              >
                <a
                  href={gmailCompose}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon="logos:google-gmail" />
                  <span className="sr-only">{t("emailLabel")}</span>
                </a>
              </Button>

              <Button
                asChild
                size="icon"
                variant="secondary"
                className="rounded-full overflow-hidden [&_svg]:h-full [&_svg]:w-full"
                title={t("whatsapp")}
                aria-label={t("whatsapp")}
              >
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <Icon icon="logos:whatsapp-icon" />
                  <span className="sr-only">{t("whatsapp")}</span>
                </a>
              </Button>

              {/* Cómo llegar (texto) */}
              <Button
                asChild
                variant="outline"
                className="rounded-full"
                title={t("directions")}
              >
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("directions")}
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Mapa embed (responsive) */}
        <ScrollReveal delay={0.15}>
          <div className="rounded-lg border overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {/* 16:9 ratio */}
              <iframe
                title={t("mapTitle")}
                src={osmEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
