const LINKS = [
  { href: "#home", label: "Inicio" },
  { href: "#calendario", label: "Calendario" },
  { href: "#fotos", label: "Fotos" },
  { href: "#contacto", label: "Contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#393E46] bg-[#222831] text-[#EEEEEE]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-semibold text-[#EEEEEE]">
              Caseta Martí i Carmeta
            </div>
            <p className="text-sm text-[#EEEEEE] opacity-80">
              Alquiler turístico. Reserva con tranquilidad y consulta la
              disponibilidad en el calendario.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-[#EEEEEE]">
              Secciones
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[#EEEEEE] opacity-80 hover:opacity-100 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-sm text-[#EEEEEE]">
              <a
                href="#home"
                className="rounded-full bg-[#EEEEEE] text-[#222831] px-4 py-2 hover:opacity-90 transition-colors"
              >
                Volver arriba
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#393E46] pt-6 text-sm text-[#EEEEEE] opacity-75 text-center">
          © {year} Caseta Martí i Carmeta
        </div>
      </div>
    </footer>
  );
}
