import HomeSection from "@/components/public/HomeSection";
import CalendarSection from "@/components/public/CalendarSection";
import Banner1 from "@/components/public/Banner1";
import Banner2 from "@/components/public/Banner2";
import GallerySection from "@/components/public/GallerySection";
import ContactSection from "@/components/public/ContactSection";
import JsonLd from "@/components/JsonLd";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CONTACT, LOCATION, OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seo" });

  const localizedUrl = `${SITE_URL}/${locale}`;
  const address = {
    "@type": "PostalAddress",
    ...(LOCATION.streetAddress ? { streetAddress: LOCATION.streetAddress } : {}),
    ...(LOCATION.locality ? { addressLocality: LOCATION.locality } : {}),
    ...(LOCATION.postalCode ? { postalCode: LOCATION.postalCode } : {}),
    addressRegion: `${LOCATION.region}, ${LOCATION.province}`,
    addressCountry: LOCATION.countryCode,
  };

  const vacationRentalJsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${localizedUrl}#vacation-rental`,
    name: SITE_NAME,
    description: t("structuredDescription"),
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

  const websiteJsonLd = {
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

  return (
    <main className="w-full">
      <JsonLd id="vacation-rental-jsonld" data={vacationRentalJsonLd} />
      <JsonLd id="website-jsonld" data={websiteJsonLd} />
      <HomeSection />
      <CalendarSection />
      <Banner1 />
      <GallerySection />
      <Banner2 />
      <ContactSection />
    </main>
  );
}
