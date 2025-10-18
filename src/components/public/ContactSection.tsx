import Section from "./Section";
import { Icon } from "@iconify/react";
import { Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

// Coordenadas de la caseta (ejemplo). Cambia por las reales.
const LAT = 40.72502884042648;
const LNG = 0.6799424640762735;

// Enlace a “Cómo llegar” (abre Google Maps con destino)
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

// URL del iframe (embed). Puedes sustituir por una URL de “Compartir > Insertar mapa” de Google Maps si prefieres.
const embedSrc = `https://www.google.com/maps?q=${LAT},${LNG}&hl=es&z=15&output=embed`;

export default function ContactSection() {
  const email = "alquiler@casetamartiicarmeta.es";
  const phone = "+34 600 000 000";
  const whatsapp =
    "https://wa.me/34600000000?text=Hola%2C%20me%20interesa%20la%20caseta";

  // arriba del componente, puedes preparar la URL:
  const subject = "Reserva caseta";
  const body = "Hola, me interesa la caseta. Fechas: ____  Personas: ____";
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <Section
      id="contacto"
      title="Contacto"
      lead="¿Tienes dudas o quieres reservar? Escríbenos y te respondemos lo antes posible. Puedes contactarnos por WhatsApp, teléfono o correo, o usar el formulario de esta página para indicarnos fechas y número de personas. También te ayudamos con cómo llegar, recomendaciones de la zona y cualquier detalle que necesites para tu estancia."
      center
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Datos de contacto */}
        <div className="space-y-1">
          <p className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-muted-foreground" aria-hidden />
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="hover:underline underline-offset-2"
            >
              {phone}
            </a>
          </p>

          <p className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" aria-hidden />
            <a
              href={`mailto:${email}`}
              className="hover:underline underline-offset-2"
            >
              {email}
            </a>
          </p>

          <p className="text-muted-foreground">
            Indica fechas y número de personas, te responderemos pronto.
          </p>
          <div className="mt-3 flex flex-wrap gap-6">
            <Button
              asChild
              size="icon"
              className="rounded-md overflow-hidden [&_svg]:h-full [&_svg]:w-full"
              title="Escribir email"
              aria-label="Escribir email"
            >
              <a href={gmailCompose} target="_blank" rel="noopener noreferrer">
                <Icon icon="logos:google-gmail" />
                <span className="sr-only">Escribir email</span>
              </a>
            </Button>

            <Button
              asChild
              size="icon"
              variant="secondary"
              className="rounded-full overflow-hidden [&_svg]:h-full [&_svg]:w-full"
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <Icon icon="logos:whatsapp-icon" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </Button>

            {/* Cómo llegar (texto) */}
            <Button
              asChild
              variant="outline"
              className="rounded-full"
              title="Cómo llegar"
            >
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cómo llegar
              </a>
            </Button>
          </div>
        </div>

        {/* Mapa embed (responsive) */}
        <div className="rounded-lg border overflow-hidden">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {/* 16:9 ratio */}
            <iframe
              title="Ubicación Caseta Martí i Carmeta"
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
