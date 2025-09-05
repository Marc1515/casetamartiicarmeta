// src/app/page.tsx
import HomeSection from "@/components/public/HomeSection";
import CalendarSection from "@/components/public/CalendarSection";
import GallerySection from "@/components/public/GallerySection";
import ContactSection from "@/components/public/ContactSection";

export default function Home() {
  return (
    <main className="w-full">
      <HomeSection />
      <CalendarSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}
