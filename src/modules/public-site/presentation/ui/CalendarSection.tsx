import Section from "./Section";
import CalendarPublic from "@/modules/reservations/presentation/ui/CalendarPublic";
import { getTranslations } from "next-intl/server";
import CalendarInfo from "./calendar/CalendarInfo";

export default async function CalendarSection() {
  const t = await getTranslations("calendar");

  return (
    <Section
      className="whitespace-pre-line pb-32"
      id="calendario"
      title={t("title")}
      titleClassName="text-3xl md:text-5xl text-[#393E46]"
      leadClassName="text-sm md:text-base text-[#393E46]"
      center
      lead={
        <>
          {t("leadMarkedAs")}{" "}
          <span className="hidden sm:inline">
            <strong>{t("reserved")}</strong>
          </span>
          <span
            className="reserved-day-icon sm:hidden"
            aria-hidden
            title={t("reservedDayTitle")}
          />{" "}
          {t("lead")}
        </>
      }
    >
      <div className="grid gap-10 overflow-x-clip xl:grid-cols-3 xl:items-stretch">
        <div className="min-w-0 xl:col-span-2">
          <CalendarPublic />
        </div>

        <aside>
          <CalendarInfo />
        </aside>
      </div>
    </Section>
  );
}
