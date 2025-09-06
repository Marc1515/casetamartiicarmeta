// src/components/public/HomeSection.tsx
import Image from "next/image";

export default function HomeSection() {
  return (
    <section id="home" className="relative min-h-screen w-full">
      {/* Imagen full-bleed */}
      <Image
        src="/img/housebetter.png"
        alt="Caseta Martí i Carmeta"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Scrim superior (suave) para títulos */}
      <div
        className="pointer-events-none absolute inset-0
                   bg-gradient-to-b from-black/50 via-transparent to-transparent"
      />

      {/* Scrim izquierdo: oscurece solo la zona del texto */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0
                   w-full md:w-[60%] bg-gradient-to-r
                   from-black/70 via-black/35 to-transparent"
      />

      {/* Contenido */}
      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-4">
          {/* Reserva para la futura navbar */}
          <div className="max-w-2xl pt-24 pb-16 md:pt-32 md:pb-24">
            <h1
              className="text-4xl md:text-6xl font-bold text-white
                           drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            >
              Caseta Martí i Carmeta
            </h1>
            <p
              className="mt-3 text-white/90
                          drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            >
              Alojamiento acogedor para escapadas cerca del mar y la naturaleza.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#calendario"
                className="rounded-md bg-white/90 px-5 py-3 font-medium text-slate-900 hover:bg-white"
              >
                Ver disponibilidad
              </a>
              <a
                href="#fotos"
                className="rounded-md border border-white/70 bg-white/10 px-5 py-3 font-medium text-white hover:bg-white/15"
              >
                Ver fotos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
