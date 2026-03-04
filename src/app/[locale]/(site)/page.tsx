import HomeSection from "@/components/public/HomeSection";
import CalendarSection from "@/components/public/CalendarSection";
import Banner1 from "@/components/public/Banner1";
import Banner2 from "@/components/public/Banner2";
import GallerySection from "@/components/public/GallerySection";
import ContactSection from "@/components/public/ContactSection";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="w-full">
      <HomeSection />
      <CalendarSection />
      <Banner1 />
      <GallerySection />
      <Banner2 />
      <ContactSection />
    </main>
  );
}
