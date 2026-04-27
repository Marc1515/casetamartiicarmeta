import Section from "./Section";
import CalendarPublic from "@/modules/reservations/presentation/ui/CalendarPublic";
import { getTranslations } from "next-intl/server";

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
          {t("leadMiddle")}
        </>
      }
    >
      <div className="grid gap-10 overflow-x-clip xl:grid-cols-3 xl:items-stretch">
        <div className="min-w-0 xl:col-span-2">
          <CalendarPublic />
        </div>

        <aside className="flex flex-col gap-4 mt-10 min-w-0 xl:col-span-1 text-sm leading-snug text-[#393E46]">
          <p>
            En el siguiente calendario puedes consultar de forma clara la
            disponibilidad de la caseta mes a mes.
          </p>
          <p>
            Una vez tengas tus fechas, puedes ponerte en contacto con nosotros
            para confirmar la reserva.
          </p>
          <h3 className="text-lg font-semibold">Temporada Alta</h3>
          <p>
            Julio y agosto, así como periodos especiales como Navidad y Semana
            Santa.
          </p>
          <h3 className="text-lg font-semibold">Información adicional</h3>
          <p>
            La estancia mínima es de 3 noches. En temporada alta, la estancia
            mínima es de 4 noches. Los festivos y puentes pueden tener
            condiciones específicas según el calendario. Para estancias más
            largas, no dudes en consultarnos.
          </p>
        </aside>
      </div>
    </Section>
  );
}
