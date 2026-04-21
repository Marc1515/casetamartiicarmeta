import HomeSection from "@/modules/public-site/presentation/ui/HomeSection";
import CalendarSection from "@/modules/public-site/presentation/ui/CalendarSection";
import Banner1 from "@/modules/public-site/presentation/ui/Banner1";
import Banner2 from "@/modules/public-site/presentation/ui/Banner2";
import GallerySection from "@/modules/public-site/presentation/ui/GallerySection";
import ContactSection from "@/modules/public-site/presentation/ui/ContactSection";
import JsonLd from "@/modules/seo/presentation/components/JsonLd";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  buildVacationRentalJsonLd,
  buildWebsiteJsonLd,
} from "@/modules/seo/application/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "seo" });

  const vacationRentalJsonLd = buildVacationRentalJsonLd({
    locale,
    structuredDescription: t("structuredDescription"),
  });

  const websiteJsonLd = buildWebsiteJsonLd();

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
