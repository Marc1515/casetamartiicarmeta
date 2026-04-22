"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import NavbarDesktop from "@/modules/public-site/presentation/ui/navbar/NavbarDesktop";
import NavbarMobile from "@/modules/public-site/presentation/ui/navbar/NavbarMobile";
import LocaleFlag from "@/modules/public-site/presentation/navbar/LocaleFlag";
import {
  NAVBAR_LOCALES,
  NAVBAR_TAB_IDS,
} from "@/modules/public-site/presentation/navbar/navbar.config";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const t = useTranslations("nav");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(NAVBAR_TAB_IDS[0].id);
  const [showBrandMobile, setShowBrandMobile] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktopView(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.removeEventListener("scroll", onScroll);

    if (isDesktopView) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      setScrolled(false);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isDesktopView]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const calendarEl = document.getElementById("calendario");
    if (!calendarEl) {
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
  }, [active]);

  const sectionElsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef<number | null>(null);

  const spyLockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    sectionElsRef.current = NAVBAR_TAB_IDS.map((tab) =>
      document.getElementById(tab.id),
    ).filter(Boolean) as HTMLElement[];

    const NAV_H = isDesktopView ? 80 : 64;

    const computeActive = () => {
      if (spyLockedRef.current) return;

      const sections = sectionElsRef.current;
      if (!sections.length) return;
      const thresholdY = window.scrollY + NAV_H + 1;
      let nextActive = sections[0]?.id;

      for (const el of sections) {
        if (el.offsetTop <= thresholdY) {
          nextActive = el.id;
          continue;
        }
        break;
      }

      if (nextActive) {
        setActive(nextActive);
      }
    };

    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        computeActive();
      });
    };

    computeActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, [isDesktopView]);

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

  const goto = (id: string) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);

    spyLockedRef.current = true;
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      spyLockedRef.current = false;
      unlockTimerRef.current = null;
    }, 1200);

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
            : !isDesktopView
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
            isDesktopView ? "h-20" : "h-16",
          )}
        >
          <div className="flex-1">
            <AnimatePresence initial={false}>
              {showBrandMobile && (
                <motion.a
                  key="brand-link"
                  href="#home"
                  onClick={goto("home")}
                  className={cx(
                    "inline-block font-semibold",
                    isDesktopView ? "text-white" : "text-[#222831]",
                  )}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  Caseta Martí i Carmeta
                </motion.a>
              )}
            </AnimatePresence>
          </div>

          <NavbarDesktop
            isDesktopView={isDesktopView}
            active={active}
            t={t}
            tabIds={NAVBAR_TAB_IDS}
            goto={goto}
            prefersReduced={prefersReduced}
            locales={NAVBAR_LOCALES}
            pathname={pathname}
            currentLocale={currentLocale}
            LocaleFlag={LocaleFlag}
          />

          <NavbarMobile
            isMobileView={!isDesktopView}
            showBrandMobile={showBrandMobile}
            open={open}
            setOpen={setOpen}
            t={t}
            active={active}
            tabIds={NAVBAR_TAB_IDS}
            goto={goto}
            prefersReduced={prefersReduced}
            itemVariants={itemVariants}
            panelVariants={panelVariants}
            overlayVariants={overlayVariants}
            locales={NAVBAR_LOCALES}
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
