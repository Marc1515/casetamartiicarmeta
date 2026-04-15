import { motion } from "framer-motion";
import type { JSX, MouseEvent } from "react";

type Tab = { id: string; key: string };
type Locale = "ca" | "es" | "en" | "fr" | "de";
type LocaleOption = { locale: Locale; label: string };

type NavbarDesktopProps = {
  isTouch: boolean;
  active: string;
  t: (key: string) => string;
  tabIds: readonly Tab[];
  goto: (id: string) => (e?: MouseEvent) => void;
  prefersReduced: boolean;
  locales: readonly LocaleOption[];
  pathname: string;
  currentLocale: Locale | string;
  LocaleFlag: (props: { locale: Locale; size?: "md" | "lg" }) => JSX.Element;
};

const NavbarDesktop = ({
  isTouch,
  active,
  t,
  tabIds,
  goto,
  prefersReduced,
  locales,
  pathname,
  currentLocale,
  LocaleFlag,
}: NavbarDesktopProps) => {
  return (
    <div
      className={`relative items-center gap-1 ${isTouch ? "hidden flex-none" : "flex"}`}
    >
      {tabIds.map((tab) => {
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
      <span className="ml-2 flex items-center gap-1.5 border-l border-white/40 pl-2 text-sm text-white/90">
        {locales.map(({ locale, label }, i) => (
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
  );
};

export default NavbarDesktop;
