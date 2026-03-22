import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { inter, fraunces } from "@/lib/fonts";
import "./globals.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const metadata: Metadata = {
  title: "Caseta Martí i Carmeta",
  description: "Alquiler turístico",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") ?? "ca";

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <meta
          name="google-site-verification"
          content="6TBlT6bZDo84-eHiwR0ABuIlA2DxMqkIWVEf2UX9Jcc"
        />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
