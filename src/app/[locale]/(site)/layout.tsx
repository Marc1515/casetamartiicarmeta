import type { Metadata } from "next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
