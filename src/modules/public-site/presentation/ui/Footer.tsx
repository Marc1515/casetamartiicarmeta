"use client";

import { useTranslations } from "next-intl";
import { CONTACT } from "@/modules/seo/application/seo";
import { PUBLIC_SITE_SECTION_LINKS } from "@/modules/public-site/application/site-navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="brand-footer">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-semibold text-brand-surface">{t("title")}</div>

            <p className="text-sm text-brand-surface/80">{t("description")}</p>
            <p className="text-sm text-brand-surface/80">{t("location")}</p>

            <p className="text-sm text-brand-surface/80">
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
            <div className="text-sm font-semibold text-brand-surface">
              {t("sections")}
            </div>

            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {PUBLIC_SITE_SECTION_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-brand-surface/80 transition-colors hover:text-brand-surface"
                >
                  {t(`links.${link.translationKey}`)}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="#home"
                className="rounded-full bg-brand-surface px-4 py-2 text-brand-dark transition-colors hover:opacity-90"
              >
                {t("backToTop")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-text pt-6 text-center text-sm text-brand-surface/75">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
