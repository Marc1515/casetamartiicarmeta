// src/components/public/CalendarSection.tsx
import Section from "./Section";
import CalendarPublic from "@/components/CalendarPublic";

export default function CalendarSection() {
  return (
    <Section
      id="calendario"
      title="Calendario de disponibilidad"
      center
      lead="Consulta aquí la disponibilidad real de la caseta. Los días señalados como “reservado” no están libres; el resto pueden solicitarse. Si estás planificando una estancia larga o tienes flexibilidad de fechas, te recomendamos revisar varias semanas para encontrar el mejor encaje. Cuando tengas tus fechas, continúa hacia el formulario de contacto y te responderemos cuanto antes."
    >
      <CalendarPublic />
    </Section>
  );
}
