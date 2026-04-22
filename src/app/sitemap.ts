import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL } from "@/modules/seo/application/seo";

const PUBLIC_ROUTES = ["/"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_ROUTES.flatMap((route) => {
    const path = route === "/" ? "" : route;

    return LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((localizedLocale) => [
            localizedLocale,
            `${SITE_URL}/${localizedLocale}${path}`,
          ]),
        ),
      },
    }));
  });
}
