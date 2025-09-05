// src/components/public/CalendarSection.tsx
import Section from "./Section";
import CalendarPublic from "@/components/CalendarPublic";

export default function CalendarSection() {
  return (
    <Section
      id="calendario"
      title="Calendario de disponibilidad"
      center
      lead="Consulta las fechas ocupadas y libres."
    >
      <CalendarPublic />
    </Section>
  );
}
