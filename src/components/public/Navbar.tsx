"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import NavbarDesktop from "@/components/sections/navbar/NavbarDesktop";
import NavbarMobile from "@/components/sections/navbar/NavbarMobile";

const TAB_IDS = [
  { id: "home", key: "home" },
  { id: "calendario", key: "calendario" },
  { id: "fotos", key: "fotos" },
  { id: "contacto", key: "contacto" },
] as const;

const LOCALES = [
  { locale: "ca" as const, label: "Català" },
  { locale: "es" as const, label: "Castellano" },
  { locale: "en" as const, label: "English" },
  { locale: "fr" as const, label: "Français" },
  { locale: "de" as const, label: "Deutsch" },
] as const;

const FLAG_SIZE = 20;
const FLAG_SIZE_MOBILE = 28;

function FlagCatalan({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex overflow-hidden rounded-full bg-[#FCDD09] ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 20 14" className="w-full h-full">
        <rect width="20" height="14" fill="#FCDD09" />
        <rect y="2.33" width="20" height="1.56" fill="#DA121A" />
        <rect y="5.22" width="20" height="1.56" fill="#DA121A" />
        <rect y="8.11" width="20" height="1.56" fill="#DA121A" />
        <rect y="11" width="20" height="1.56" fill="#DA121A" />
      </svg>
    </span>
  );
}

function LocaleFlag({
  locale,
  className,
  size = "md",
}: {
  locale: (typeof LOCALES)[number]["locale"];
  className?: string;
  size?: "md" | "lg";
}) {
  const s = size === "lg" ? FLAG_SIZE_MOBILE : FLAG_SIZE;
  if (locale === "ca") return <FlagCatalan size={s} className={className} />;
  if (locale === "es")
    return (
      <Icon
        icon="circle-flags:es"
        width={s}
        height={s}
        className={className}
        aria-hidden
      />
    );
  if (locale === "fr")
    return (
      <Icon
        icon="circle-flags:fr"
        width={s}
        height={s}
        className={className}
        aria-hidden
      />
    );
  if (locale === "de")
    return (
      <Icon
        icon="circle-flags:de"
        width={s}
        height={s}
        className={className}
        aria-hidden
      />
    );
  return (
    <Icon
      icon="circle-flags:gb"
      width={s}
      height={s}
      className={className}
      aria-hidden
    />
  );
}

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Navbar() {
  const t = useTranslations("nav");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(TAB_IDS[0].id);
  const [showBrandMobile, setShowBrandMobile] = useState(false);
  // En móviles (pantallas táctiles) mantenemos SIEMPRE el modo burger,
  // incluso en horizontal, para no depender del ancho del viewport.
  const [isTouch, setIsTouch] = useState(true);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const apply = () => setIsTouch(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Fondo sólido al hacer scroll (desktop) + fondo/blur en móvil a partir de calendario
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const mq = window.matchMedia("(min-width: 768px)"); // md

    const apply = () => {
      // evita duplicar listeners
      window.removeEventListener("scroll", onScroll);

      if (!isTouch && mq.matches) {
        // desktop/tablet
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        // mobile: manejamos el fondo con showBrandMobile, no por scroll
        setScrolled(false);
      }
    };

    apply();

    // si se redimensiona, recalcula
    const onChange = () => apply();
    mq.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onChange);
    };
  }, [isTouch]);

  // Mostrar/ocultar título en móvil cuando el calendario llega al top
  useEffect(() => {
    if (!isTouch || typeof window === "undefined") {
      setShowBrandMobile(false);
      return;
    }

    const calendarEl = document.getElementById("calendario");
    if (!calendarEl) {
      // fallback: usa la sección activa si por algún motivo no existe el id
      setShowBrandMobile(active !== "home");
      return;
    }

    const NAV_H = 0;
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const rect = calendarEl.getBoundingClientRect();
      const shouldShow = rect.top <= NAV_H + 1;
      setShowBrandMobile(shouldShow);
    };

    const onScrollOrResize = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [isTouch, active]);

  // ------- SCROLL-SPY con RAF + "bloqueo" cuando el click inicia un scroll suave
  const sectionElsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef<number | null>(null);

  // 🔒 bloqueo del spy durante scroll programado
  const spyLockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    sectionElsRef.current = TAB_IDS.map((tab) =>
      document.getElementById(tab.id),
    ).filter(Boolean) as HTMLElement[];

    const NAV_H =
      !isTouch && window.matchMedia("(min-width: 768px)").matches ? 80 : 64;

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
  }, [isTouch]);

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
            : isTouch
              ? showBrandMobile
                ? "bg-black/5 backdrop-blur-md"
                : "bg-transparent"
              : "bg-gradient-to-b from-black/60 to-transparent",
        )}
      />
      <div className="mx-auto max-w-5xl px-4">
        <nav
          className={cx(
            "flex items-center justify-between",
            isTouch ? "h-16" : "h-20",
          )}
        >
          <div className="flex-1">
            <AnimatePresence initial={false}>
              {(!isTouch || showBrandMobile) && (
                <motion.a
                  key="brand-link"
                  href="#home"
                  onClick={goto("home")}
                  className={cx(
                    "inline-block font-semibold",
                    !isTouch
                      ? "text-white"
                      : showBrandMobile
                        ? "text-[#222831]"
                        : "text-[#EEEEEE]",
                  )}
                  initial={isTouch ? { opacity: 0, y: -8 } : false}
                  animate={isTouch ? { opacity: 1, y: 0 } : { opacity: 1 }}
                  exit={isTouch ? { opacity: 0, y: -8 } : { opacity: 1 }}
                  transition={{ duration: prefersReduced ? 0 : 0.25 }}
                >
                  Caseta Martí i Carmeta
                </motion.a>
              )}
            </AnimatePresence>
          </div>

          <NavbarDesktop
            isTouch={isTouch}
            active={active}
            t={t}
            tabIds={TAB_IDS}
            goto={goto}
            prefersReduced={prefersReduced}
            locales={LOCALES}
            pathname={pathname}
            currentLocale={currentLocale}
            LocaleFlag={LocaleFlag}
          />

          <NavbarMobile
            isTouch={isTouch}
            showBrandMobile={showBrandMobile}
            open={open}
            setOpen={setOpen}
            t={t}
            active={active}
            tabIds={TAB_IDS}
            goto={goto}
            prefersReduced={prefersReduced}
            itemVariants={itemVariants}
            panelVariants={panelVariants}
            overlayVariants={overlayVariants}
            locales={LOCALES}
            pathname={pathname}
            currentLocale={currentLocale}
            LocaleFlag={LocaleFlag}
            closeBtnRef={closeBtnRef}
          />
        </nav>
      </div>
    </header>
  );
}
