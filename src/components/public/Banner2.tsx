// src/components/public/Banner2.tsx

export default function Banner2() {
  return (
    <section
      id="banner2"
      aria-label="Paisaje del delta"
      className="relative w-full min-h-screen"
    >
      {/* Imagen de fondo fija a pantalla completa */}
      <div className="absolute inset-0 bg-[url('/img/deltaLandscape2.png')] bg-cover bg-center bg-fixed" />

      {/* Capa opcional para oscurecer un poco la imagen y permitir contenido encima en el futuro */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center bg-black/20">
        {/* Contenido opcional futuro */}
      </div>
    </section>
  );
}
