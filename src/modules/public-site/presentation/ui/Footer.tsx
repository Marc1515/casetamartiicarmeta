"use client";

import { useTranslations } from "next-intl";
import { CONTACT } from "@/modules/seo/application/seo";

const LINK_KEYS = [
  { href: "#home", key: "home" },
  { href: "#calendario", key: "calendario" },
  { href: "#fotos", key: "fotos" },
  { href: "#contacto", key: "contacto" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#393E46] bg-[#222831] text-[#EEEEEE]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-semibold text-[#EEEEEE]">{t("title")}</div>
            <p className="text-sm text-[#EEEEEE] opacity-80">
              {t("description")}
            </p>
            <p className="text-sm text-[#EEEEEE] opacity-80">{t("location")}</p>
            <p className="text-sm text-[#EEEEEE] opacity-80">
              {t("contact")}:{" "}
              <a href={`tel:${CONTACT.phoneClean}`} className="hover:underline">
                {CONTACT.phone}
              </a>{" "}
              -{" "}
              <a href={`mailto:${CONTACT.email}`} className="hover:underline">
                {CONTACT.email}
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-[#EEEEEE]">
              {t("sections")}
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {LINK_KEYS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[#EEEEEE] opacity-80 hover:opacity-100 transition-colors"
                >
                  {t(`links.${l.key}`)}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-sm text-[#EEEEEE]">
              <a
                href="#home"
                className="rounded-full bg-[#EEEEEE] text-[#222831] px-4 py-2 hover:opacity-90 transition-colors"
              >
                {t("backToTop")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#393E46] pt-6 text-sm text-[#EEEEEE] opacity-75 text-center">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
