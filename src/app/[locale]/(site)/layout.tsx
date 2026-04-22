import type { Metadata } from "next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "@/modules/public-site/presentation/ui/Navbar";
import Footer from "@/modules/public-site/presentation/ui/Footer";
import AppShell from "@/modules/public-site/presentation/ui/AppShell";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import {
  LOCALES,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/modules/seo/application/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const canonicalUrl = `${SITE_URL}/${locale}`;
  const languageAlternates = Object.fromEntries(
    LOCALES.map((localizedLocale) => [
      localizedLocale,
      `${SITE_URL}/${localizedLocale}`,
    ]),
  );
  const openGraphLocaleByLocale: Record<(typeof LOCALES)[number], string> = {
    ca: "ca_ES",
    es: "es_ES",
    en: "en_US",
    fr: "fr_FR",
    de: "de_DE",
  };

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        "x-default": `${SITE_URL}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: t("ogTitle"),
      description: t("ogDescription"),
      locale: openGraphLocaleByLocale[locale as (typeof LOCALES)[number]],
      images: [
        {
          url: `${SITE_URL}${OG_IMAGE_PATH}`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [`${SITE_URL}${OG_IMAGE_PATH}`],
    },
    robots: {
      index: true,
      follow: true,
    },
    category: "travel",
  };
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AppShell>
      <Navbar />
      {children}
      <Footer />
    </AppShell>
  );
}
