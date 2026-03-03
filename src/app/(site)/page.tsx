// src/app/page.tsx
import HomeSection from "@/components/public/HomeSection";
import CalendarSection from "@/components/public/CalendarSection";
import Banner1 from "@/components/public/Banner1";
import Banner2 from "@/components/public/Banner2";
import GallerySection from "@/components/public/GallerySection";
import ContactSection from "@/components/public/ContactSection";

export default function Home() {
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
