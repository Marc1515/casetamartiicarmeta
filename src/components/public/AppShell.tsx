// src/components/public/AppShell.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Espera un pequeño tiempo tras la hidratación para dejar que arranquen las animaciones
    const timeout = window.setTimeout(() => {
      setReady(true);
    }, 600);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Contenido de la app, ligeramente difuminado mientras carga */}
      <div className={ready ? "" : "blur-sm"}>{children}</div>

      {/* Capa superior con spinner */}
      {!ready && (
        <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="pointer-events-auto rounded-full border-4 border-white/30 border-t-white h-10 w-10 animate-spin" />
        </div>
      )}
    </>
  );
}
