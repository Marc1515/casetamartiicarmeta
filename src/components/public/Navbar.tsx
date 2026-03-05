"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Icon } from "@iconify/react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

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
  if (locale === "ca")
    return (
      <FlagCatalan
        size={s}
        className={className}
      />
    );
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

  // Fondo sólido al hacer scroll
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
        // mobile: no scroll effect
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
              ? "bg-transparent"
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
          <a
            href="#home"
            onClick={goto("home")}
            className="text-white font-semibold"
          >
            Caseta Martí i Carmeta
          </a>

          {/* DESKTOP: píldora + bubble + idioma */}
          <div
            className={cx(
              "relative items-center gap-1",
              isTouch ? "hidden" : "flex",
            )}
          >
            {TAB_IDS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={goto(tab.id)}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium ${
                    isActive ? "text-black" : "text-white/90 hover:text-white"
                  } transition-colors`}
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
                  <span className="relative z-10">{t(tab.key)}</span>
                </a>
              );
            })}
            {/* Selector de idioma */}
            <span className="ml-2 flex items-center gap-1.5 border-l border-white/40 pl-2 text-sm text-white/90">
              {LOCALES.map(({ locale, label }, i) => (
                <span key={locale} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden>|</span>}
                  <a
                    href={`/${locale}${pathname === "/" ? "" : pathname}`}
                    title={label}
                    aria-label={label}
                    className={
                      currentLocale === locale
                        ? "opacity-100 ring-2 ring-white ring-offset-2 ring-offset-transparent rounded-sm"
                        : "opacity-80 hover:opacity-100"
                    }
                    aria-current={currentLocale === locale ? "true" : undefined}
                  >
                    <LocaleFlag locale={locale} />
                  </a>
                </span>
              ))}
            </span>
          </div>

          {/* BURGER (móvil) */}
          <button
            aria-label={t("openMenu")}
            className={cx("text-[#222831]", isTouch ? "" : "hidden")}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </div>

      {/* MENÚ MÓVIL FULL-SCREEN */}
      <AnimatePresence>
        {open && isTouch && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[60]"
            role="dialog"
            aria-modal="true"
            aria-label={t("menuAria")}
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
                aria-label={t("closeMenu")}
                className="absolute right-4 top-4 text-white"
                onClick={() => setOpen(false)}
                ref={closeBtnRef}
              >
                <X className="h-7 w-7" />
              </button>

              {TAB_IDS.map((tab, idx) => {
                const isActive = active === tab.id;
                return (
                  <motion.a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={(e) => {
                      goto(tab.id)(e);
                      setOpen(false);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    variants={itemVariants}
                    transition={{ delay: prefersReduced ? 0 : idx * 0.05 }}
                    className={cx(
                      "relative text-white/90 text-2xl font-semibold px-3 py-1 transition-colors",
                      isActive ? "text-white" : "hover:text-white",
                      "after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-white after:transition-[width] after:duration-300",
                      isActive ? "after:w-1/2" : "hover:after:w-1/2",
                    )}
                  >
                    {t(tab.key)}
                  </motion.a>
                );
              })}
              {/* Selector idioma en móvil */}
              <div className="mt-4 flex gap-4 text-white/90">
                {LOCALES.map(({ locale, label }) => (
                  <a
                    key={locale}
                    href={`/${locale}${pathname === "/" ? "" : pathname}`}
                    title={label}
                    aria-label={label}
                    className={
                      currentLocale === locale
                        ? "opacity-100 ring-2 ring-white ring-offset-2 ring-offset-black/90 rounded-sm"
                        : "opacity-70 hover:opacity-100"
                    }
                    aria-current={currentLocale === locale ? "true" : undefined}
                  >
                    <LocaleFlag locale={locale} size="lg" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
