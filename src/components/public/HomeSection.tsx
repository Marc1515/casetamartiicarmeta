// src/components/public/HomeSection.tsx
import Image from "next/image";

export default function HomeSection() {
  return (
    <section
      id="home"
      className="relative justify-center flex w-full min-h-screen"
    >
      {/* Imagen full-bleed */}
      <Image
        src="/img/housebetter.png"
        alt="Caseta Martí i Carmeta"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Oscurecido para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/20" />

      {/* Contenido */}
      <div className="relative z-10 flex h-full items-center mt-40">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="relative max-w-4xl">
            {/* Capa de fondo con blur + color + máscara (NO afecta al texto) */}
            {/* <div
              aria-hidden
              className="
          absolute inset-0 rounded-2xl
          bg-black/35 supports-[backdrop-filter]:bg-black/15
          backdrop-blur-md ring-1 ring-white/20
          mask-feather
          pointer-events-none z-0
        "
            /> */}
            {/* Contenido limpio, sin máscara */}
            <div className="relative z-10 rounded-2xl p-6 md:p-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
                Caseta Martí i Carmeta
              </h1>
              <p className="mt-3 max-w-prose text-white/90">
                Alojamiento acogedor para escapadas cerca del mar y la
                naturaleza.
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
      </div>
    </section>
  );
}
