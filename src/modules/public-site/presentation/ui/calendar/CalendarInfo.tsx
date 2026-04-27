import { useTranslations } from "next-intl";

export default function CalendarInfo() {
  const t = useTranslations("calendar.info");

  return (
    <div className="flex flex-col gap-4 mt-16 min-w-0 xl:col-span-1 text-sm leading-snug text-[#393E46]">
      <p>{t("intro")}</p>
      <p>{t("intro2")}</p>
      <div>
        <p className="font-semibold">{t("highSeasonTitle")}</p>
        <p>{t("highSeasonText")}</p>
      </div>

      <div>
        <p className="font-semibold">{t("additionalInfoTitle")}</p>
        <p>{t("additionalInfoText")}</p>
      </div>
    </div>
  );
}
