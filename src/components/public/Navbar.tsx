"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const TABS = [
  { id: "home", label: "Inicio" },
  { id: "calendario", label: "Calendario" },
  { id: "fotos", label: "Fotos" },
  { id: "contacto", label: "Contacto" },
];

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(TABS[0].id);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Fondo sólido al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ------- SCROLL-SPY con RAF + "bloqueo" cuando el click inicia un scroll suave
  const sectionElsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef<number | null>(null);

  // 🔒 bloqueo del spy durante scroll programado
  const spyLockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  // libera bloqueo cuando la sección objetivo ya está bajo la línea de referencia
  const unlockWhenReached = (target: HTMLElement) => {
    const NAV_H = window.matchMedia("(min-width: 768px)").matches ? 80 : 64;
    const probeY = NAV_H + Math.min(window.innerHeight * 0.25, 200);

    const check = () => {
      if (!spyLockedRef.current) return; // ya liberado
      const r = target.getBoundingClientRect();
      if (r.top <= probeY && r.bottom >= probeY) {
        spyLockedRef.current = false;
        if (unlockTimerRef.current) {
          clearTimeout(unlockTimerRef.current);
          unlockTimerRef.current = null;
        }
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  };

  useEffect(() => {
    sectionElsRef.current = TABS.map((t) =>
      document.getElementById(t.id)
    ).filter(Boolean) as HTMLElement[];

    const NAV_H = window.matchMedia("(min-width: 768px)").matches ? 80 : 64;

    const computeActive = () => {
      if (spyLockedRef.current) return; // 🔒 no re-calcular mientras hay scroll por click

      const sections = sectionElsRef.current;
      if (!sections.length) return;
      const probeY = NAV_H + Math.min(window.innerHeight * 0.25, 200);

      const containing = sections.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probeY && r.bottom >= probeY;
      });
      if (containing?.id) {
        setActive(containing.id);
        return;
      }
      const nearest = sections
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { id: el.id, d: Math.abs(r.top - probeY) };
        })
        .sort((a, b) => a.d - b.d)[0];
      if (nearest?.id) setActive(nearest.id);
    };

    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        computeActive();
      });
    };

    // inicial + listeners
    computeActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, []);

  // Bloquear scroll + accesibilidad del menú móvil
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) setTimeout(() => closeBtnRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Variants móvil
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.06 },
    },
    exit: { opacity: 0, scale: 0.98, y: 10 },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  // Click: mueve bubble al instante + bloquea spy + scroll suave + desbloqueo al llegar o por timeout
  const goto = (id: string) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);

    // 🔒 bloquea el spy
    spyLockedRef.current = true;
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      spyLockedRef.current = false;
      unlockTimerRef.current = null;
    }, 1200); // “paraguas” si el scroll es largo

    unlockWhenReached(el); // libera antes si ya llegó
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cx(
          "pointer-events-none absolute inset-0 -z-10 transition-colors",
          scrolled
            ? "bg-black/65"
            : "bg-gradient-to-b from-black/60 to-transparent"
        )}
      />
      <div className="mx-auto max-w-5xl px-4">
        <nav className="flex h-16 md:h-20 items-center justify-between">
          <Link
            href="#home"
            onClick={goto("home")}
            className="text-white font-semibold"
          >
            {/* Caseta Martí i Carmeta */}
          </Link>

          {/* DESKTOP: píldora + bubble */}
          <div className="relative hidden md:flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-md">
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  onClick={goto(t.id)}
                  aria-current={isActive ? "page" : undefined}
                  className="relative rounded-full px-3 py-1.5 text-sm font-medium text-white/90 hover:text-white transition-colors"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-bubble"
                      className="absolute inset-0 rounded-full bg-white mix-blend-difference"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { type: "spring", bounce: 0.2, duration: 0.45 }
                      }
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </a>
              );
            })}
          </div>

          {/* BURGER (móvil) */}
          <button
            aria-label="Abrir menú"
            className="md:hidden text-white"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </div>

      {/* MENÚ MÓVIL FULL-SCREEN */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[60] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/90"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
              variants={panelVariants}
              transition={{ duration: prefersReduced ? 0 : 0.25 }}
            >
              <button
                aria-label="Cerrar menú"
                className="absolute right-4 top-4 text-white"
                onClick={() => setOpen(false)}
                ref={closeBtnRef}
              >
                <X className="h-7 w-7" />
              </button>

              {TABS.map((t, idx) => {
                const isActive = active === t.id;
                return (
                  <motion.a
                    key={t.id}
                    href={`#${t.id}`}
                    onClick={(e) => {
                      goto(t.id)(e);
                      setOpen(false);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    variants={itemVariants}
                    transition={{ delay: prefersReduced ? 0 : idx * 0.05 }}
                    className={cx(
                      "relative text-white/90 text-2xl font-semibold px-3 py-1 transition-colors",
                      isActive ? "text-white" : "hover:text-white",
                      "after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-white after:transition-[width] after:duration-300",
                      isActive ? "after:w-1/2" : "hover:after:w-1/2"
                    )}
                  >
                    {t.label}
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
