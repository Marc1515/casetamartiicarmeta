// src/components/public/CalendarSection.tsx
import Section from "./Section";
import CalendarPublic from "@/components/CalendarPublic";
import { getTranslations } from "next-intl/server";

export default async function CalendarSection() {
  const t = await getTranslations("calendar");

  return (
    <Section
      className="whitespace-pre-line"
      id="calendario"
      title={t("title")}
      titleClassName="text-[#393E46]"
      leadClassName="text-[#393E46]"
      center
      lead={
        <>
          {t("leadIntro")}
          {"\n\n"}
          {t("leadMarkedAs")}{" "}
          <span className="hidden sm:inline">
            <strong>{t("reserved")}</strong>
          </span>
          <span
            className="reserved-day-icon sm:hidden"
            aria-hidden
            title={t("reservedDayTitle")}
          />{" "}
          {t("leadMiddle")}
          {"\n\n"}
          {t("leadEnd")}
        </>
      }
    >
      <CalendarPublic />
    </Section>
  );
}
