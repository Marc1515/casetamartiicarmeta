// src/components/public/CalendarSection.tsx
import Section from "./Section";
import CalendarPublic from "@/components/CalendarPublic";

export default function CalendarSection() {
  return (
    <Section
      className="whitespace-pre-line"
      id="calendario"
      title="Calendario de disponibilidad"
      titleClassName="text-[#393E46]"
      leadClassName="text-[#393E46]"
      center
      lead={
        <>
          Consulta aquí la disponibilidad real de la caseta.{"\n\n"}
          Los días señalados como{" "}
          <span className="hidden sm:inline">
            <strong>RESERVADO</strong>
          </span>
          <span
            className="reserved-day-icon sm:hidden"
            aria-hidden
            title="Día reservado"
          />{" "}
          no están libres; el resto pueden solicitarse. Si estás planificando
          una estancia larga o tienes flexibilidad de fechas, te recomendamos
          revisar varias semanas para encontrar el mejor encaje.{"\n\n"}
          Cuando tengas tus fechas, continúa hacia la sección de contacto, te
          responderemos cuanto antes.
        </>
      }
    >
      <CalendarPublic />
    </Section>
  );
}
