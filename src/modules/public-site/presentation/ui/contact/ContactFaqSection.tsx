"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CONTACT_FAQS,
  type ContactFaq,
} from "@/modules/public-site/application/contact-faqs";

function ContactFaqItem({ faq }: { faq: ContactFaq }) {
  const t = useTranslations("contact.faqs");
  const [isOpen, setIsOpen] = useState(false);

  const panelId = `contact-faq-${faq.id}`;

  const items = faq.hasList ? (t.raw(`${faq.id}.items`) as string[]) : [];

  return (
    <article className="min-h-22 rounded-2xl border border-black/10 bg-[#EEEEEE] p-5 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="font-semibold leading-snug text-[#393E46]">
          {t(`${faq.id}.question`)}
        </span>

        <ChevronDown
          className={`mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#393E46]">
            <p>{t(`${faq.id}.answer`)}</p>

            {items.length > 0 ? (
              <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ContactFaqSection() {
  const t = useTranslations("contact.faqs");

  const leftColumnFaqs = CONTACT_FAQS.filter((_, index) => index % 2 === 0);
  const rightColumnFaqs = CONTACT_FAQS.filter((_, index) => index % 2 !== 0);

  return (
    <div className="mt-20">
      <div className="mb-12 flex items-start gap-3">
        <div>
          <h3 className="mb-6 text-2xl font-semibold tracking-tight text-[#393E46] md:text-3xl">
            {t("title")}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("lead")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          {leftColumnFaqs.map((faq) => (
            <ContactFaqItem key={faq.id} faq={faq} />
          ))}
        </div>

        <div className="space-y-4">
          {rightColumnFaqs.map((faq) => (
            <ContactFaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </div>
  );
}
