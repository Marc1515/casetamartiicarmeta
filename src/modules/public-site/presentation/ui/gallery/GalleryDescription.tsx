"use client";

import { useTranslations } from "next-intl";

export default function GalleryDescription() {
  const t = useTranslations("gallery.description");

  return (
    <div className="mt-8 rounded-2xl border bg-[#EEEEEE] p-5 text-sm leading-7 text-[#393E46] shadow-sm md:p-6 md:text-base">
      <p>{t("paragraph1")}</p>
      <p className="mt-4">{t("paragraph2")}</p>
      <p className="mt-4">{t("paragraph3")}</p>
    </div>
  );
}
