// src/app/page.tsx
import HomeSection from "@/components/public/HomeSection";
import CalendarSection from "@/components/public/CalendarSection";
import Banner1 from "@/components/public/Banner1";
import GallerySection from "@/components/public/GallerySection";
import ContactSection from "@/components/public/ContactSection";

export default function Home() {
  return (
    <main className="w-full">
      <HomeSection />
      <CalendarSection />
      <Banner1 />
      <GallerySection />
      <ContactSection />
    </main>
  );
}
