// src/components/public/ContactSection.tsx
import Section from "./Section";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  const email = "alquiler@casetamartiicarmeta.es";
  const phone = "+34 600 000 000";
  const whatsapp =
    "https://wa.me/34600000000?text=Hola%2C%20me%20interesa%20la%20caseta";

  return (
    <Section id="contacto" title="Contacto" center>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <p>
            <span className="font-medium">Teléfono:</span> {phone}
          </p>
          <p>
            <span className="font-medium">Email:</span> {email}
          </p>
          <p className="text-muted-foreground">
            Indica fechas y número de personas, te responderemos pronto.
          </p>
          <div className="mt-3 flex gap-2">
            <Button asChild>
              <a href={`mailto:${email}`}>Escribir email</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={whatsapp} target="_blank">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          Aquí puedes añadir un mapa o más información útil.
        </div>
      </div>
    </Section>
  );
}
