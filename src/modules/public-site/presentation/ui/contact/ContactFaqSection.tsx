"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT_FAQS } from "@/modules/public-site/application/contact-faqs";

export default function ContactFaqSection() {
  const t = useTranslations("contact.faqs");

  return (
    <div className="mt-14">
      <div className="mb-6 flex items-start gap-3">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-[#393E46] md:text-3xl">
            {t("title")}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("lead")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {CONTACT_FAQS.map((faq) => (
          <details
            key={faq.id}
            className="group rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm transition hover:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <span className="font-semibold leading-snug text-[#393E46]">
                {t(`${faq.id}.question`)}
              </span>

              <ChevronDown
                className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition group-open:rotate-180"
                aria-hidden
              />
            </summary>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#393E46]">
              <p>{t(`${faq.id}.answer`)}</p>

              {faq.hasList ? (
                <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
                  {t.raw(`${faq.id}.items`).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
