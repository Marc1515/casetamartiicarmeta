"use client";

import { useTranslations } from "next-intl";
import { Bike, Bus, Coffee, Plane, Waves } from "lucide-react";

type SurroundingItem = {
  name: string;
  distance: string;
};

type SurroundingSection = {
  title: string;
  icon: React.ReactNode;
  items: SurroundingItem[];
};

export default function GallerySurroundings() {
  const t = useTranslations("gallery.surroundings");

  const sections: SurroundingSection[] = [
    {
      title: t("nearby.title"),
      icon: <Bike className="h-5 w-5" aria-hidden />,
      items: [
        { name: t("nearby.parcDelRiu"), distance: "2,2 km" },
        { name: t("nearby.ecoherbesPark"), distance: "13 km" },
        { name: t("nearby.deltaEbro"), distance: "16 km" },
        { name: t("nearby.ullalsBaltasar"), distance: "17 km" },
        { name: t("nearby.naturalPark"), distance: "19 km" },
      ],
    },
    {
      title: t("restaurants.title"),
      icon: <Coffee className="h-5 w-5" aria-hidden />,
      items: [
        { name: t("restaurants.casaRius"), distance: "700 m" },
        { name: t("restaurants.loMut"), distance: "800 m" },
        { name: t("restaurants.masPrades"), distance: "3,2 km" },
      ],
    },
    {
      title: t("beaches.title"),
      icon: <Waves className="h-5 w-5" aria-hidden />,
      items: [
        { name: t("beaches.arenal"), distance: "9 km" },
        { name: t("beaches.fangar"), distance: "15 km" },
        { name: t("beaches.riumar"), distance: "16 km" },
        { name: t("beaches.trabucador"), distance: "19 km" },
        { name: t("beaches.migjorn"), distance: "20 km" },
        { name: t("beaches.eucaliptus"), distance: "20 km" },
      ],
    },
    {
      title: t("transport.title"),
      icon: <Bus className="h-5 w-5" aria-hidden />,
      items: [
        { name: t("transport.camarlesDeltebre"), distance: "7 km" },
        { name: t("transport.aldeaAmposta"), distance: "9 km" },
      ],
    },
    {
      title: t("airports.title"),
      icon: <Plane className="h-5 w-5" aria-hidden />,
      items: [
        { name: t("airports.reus"), distance: "71 km" },
        { name: t("airports.castellon"), distance: "94 km" },
      ],
    },
  ];

  return (
    <div className="mt-8 rounded-2xl border bg-[#EEEEEE] p-5 text-[#393E46] shadow-sm md:p-6">
      <h3 className="text-2xl font-bold">{t("title")}</h3>

      <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title}>
            <div className="mb-5 flex items-center gap-2">
              {section.icon}
              <h4 className="font-bold">{section.title}</h4>
            </div>

            <ul className="space-y-4 text-sm md:text-base">
              {section.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-start justify-between gap-4"
                >
                  <span>{item.name}</span>
                  <span className="shrink-0 text-[#393E46]/80">
                    {item.distance}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
