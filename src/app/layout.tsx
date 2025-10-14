import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "@/components/public/Navbar";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Caseta Martí i Carmeta",
  description: "Alquiler turístico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
