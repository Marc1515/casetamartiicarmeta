// src/components/public/Section.tsx
type Props = {
  id: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  center?: boolean; // centra verticalmente el contenido
};

export default function Section({
  id,
  title,
  lead,
  children,
  className,
  center = false,
}: Props) {
  return (
    <section
      id={id}
      className={`w-full scroll-mt-20 min-h-screen py-16 md:py-24 ${
        className ?? ""
      }`}
    >
      <div
        className={`mx-auto w-full max-w-5xl px-4 ${
          center ? "flex flex-col justify-center" : ""
        }`}
      >
        {title && (
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">
            {title}
          </h2>
        )}
        {lead && <p className="mb-6 text-muted-foreground">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
