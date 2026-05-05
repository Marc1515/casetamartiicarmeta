"use client";

import Section from "./Section";
import {
  getPopularServices,
  getServiceGroups,
} from "@/modules/public-site/application/services-section";
import type {
  PopularServiceId,
  ServiceGroupId,
} from "@/modules/public-site/domain/service";
import {
  Bike,
  Building,
  Car,
  Check,
  CookingPot,
  Languages,
  Monitor,
  ParkingCircle,
  PersonStanding,
  ShowerHead,
  Sofa,
  Trees,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const POPULAR_SERVICE_ICONS: Record<PopularServiceId, LucideIcon> = {
  outdoorPool: Waves,
  freeParking: ParkingCircle,
  freeWifi: Wifi,
};

const SERVICE_GROUP_ICONS: Record<ServiceGroupId, LucideIcon> = {
  idealStay: PersonStanding,
  parking: ParkingCircle,
  internet: Wifi,
  kitchen: CookingPot,
  bedroom: Building,
  bathroom: ShowerHead,
  livingArea: Sofa,
  mediaAndTechnology: Monitor,
  roomAmenities: Building,
  outdoors: Trees,
  outdoorPool: Waves,
  activities: Bike,
  views: Trees,
  buildingCharacteristics: Building,
  miscellaneous: Check,
  spokenLanguages: Languages,
};

export default function ServicesSection() {
  const t = useTranslations("services");

  const popularServices = getPopularServices();
  const serviceGroups = getServiceGroups();

  return (
    <Section
      id="servicios"
      title={t("title")}
      lead={t("lead")}
      className="bg-[#EEEEEE]"
      titleClassName="text-3xl md:text-5xl text-[#222831]"
      leadClassName="text-sm md:text-base text-[#393E46]"
    >
      <div className="space-y-12 text-[#222831]">
        <div>
          <h3 className="mb-5 text-lg font-semibold">{t("popularTitle")}</h3>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            {popularServices.map((service) => {
              const Icon = POPULAR_SERVICE_ICONS[service.id];

              return (
                <div key={service.id} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-600" aria-hidden />
                  <span>{t(`popular.${service.id}`)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="columns-1 gap-12 md:columns-2 xl:columns-3">
          {serviceGroups.map((group) => {
            const Icon = SERVICE_GROUP_ICONS[group.id];

            return (
              <article key={group.id} className="mb-8 break-inside-avoid">
                <header className="mb-3 flex items-center gap-3">
                  <Icon className="h-6 w-6 shrink-0" aria-hidden />
                  <h3 className="text-lg font-semibold">
                    {t(`groups.${group.id}.title`)}
                  </h3>
                </header>

                {group.hasDescription ? (
                  <p className="mb-3 text-sm leading-6 text-[#393E46]">
                    {t(`groups.${group.id}.description`)}
                  </p>
                ) : null}

                {group.items.length > 0 ? (
                  <ul className="space-y-2">
                    {group.items.map((itemId) => (
                      <li
                        key={`${group.id}-${itemId}`}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden
                        />

                        <span>{t(`items.${itemId}`)}</span>

                        {group.badgeItemId === itemId ? (
                          <span className="rounded-sm bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                            {t("badge.free")}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
