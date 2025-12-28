import type { Metadata } from "next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "@/components/public/Navbar";

export const metadata: Metadata = {
  title: "Caseta Martí i Carmeta",
  description: "Alquiler turístico",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
