import { useTranslations } from "next-intl";

export default function CalendarInfo() {
  const t = useTranslations("calendar.info");

  return (
    <div className="h-full rounded-2xl border bg-[#EEEEEE] p-5 text-xs leading-7 text-[#393E46] shadow-sm md:p-6">
      <p className="mb-3">{t("intro")}</p>
      <div className="flex flex-col gap-1 mb-3">
        <p className="font-semibold">{t("highSeasonTitle")}</p>
        <p>{t("highSeasonText")}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-semibold">{t("additionalInfoTitle")}</p>
        <p>{t("additionalInfoText")}</p>
      </div>
    </div>
  );
}
