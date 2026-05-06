"use client";

import Section from "./Section";
import { Icon } from "@iconify/react";
import { Phone, Mail } from "lucide-react";
import { ScrollReveal } from "@/shared/presentation/ui/scroll-reveal";
import { Button } from "@/shared/presentation/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  getContactSectionDirectionsHref,
  getContactSectionEmail,
  getContactSectionGmailComposeHref,
  getContactSectionMapEmbedSrc,
  getContactSectionPhone,
  getContactSectionPhoneHref,
  getContactSectionWhatsappHref,
} from "@/modules/public-site/application/contact-section";
import ContactFaqSection from "./contact/ContactFaqSection";

export default function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const email = getContactSectionEmail();
  const phone = getContactSectionPhone();
  const phoneHref = getContactSectionPhoneHref();
  const whatsappHref = getContactSectionWhatsappHref();
  const directionsHref = getContactSectionDirectionsHref();
  const gmailComposeHref = getContactSectionGmailComposeHref();
  const mapEmbedSrc = getContactSectionMapEmbedSrc(locale);

  return (
    <Section
      id="contacto"
      className="whitespace-pre-line"
      title={t("title")}
      titleClassName="text-3xl md:text-5xl text-[#393E46]"
      leadClassName="text-sm md:text-base text-[#393E46]"
      lead={t("lead")}
      center
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ScrollReveal>
          <div className="space-y-1 text-sm md:text-base">
            <p className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" aria-hidden />
              <a
                href={phoneHref}
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

            <p className="text-muted-foreground py-3">{t("hint")}</p>

            <div className="mt-3 flex flex-wrap gap-6 pb-3">
              <Button
                asChild
                size="icon"
                className="rounded-md overflow-hidden [&_svg]:h-full [&_svg]:w-full"
                title={t("emailLabel")}
                aria-label={t("emailLabel")}
              >
                <a
                  href={gmailComposeHref}
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
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon="logos:whatsapp-icon" />
                  <span className="sr-only">{t("whatsapp")}</span>
                </a>
              </Button>

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

        <ScrollReveal delay={0.15}>
          <div className="rounded-lg border overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                title={t("mapTitle")}
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-describedby="map-description"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <p
              id="map-description"
              className="px-3 py-2 text-sm text-muted-foreground"
            >
              {t("mapCaption")}
            </p>
          </div>
        </ScrollReveal>
      </div>
      <ContactFaqSection />
    </Section>
  );
}
