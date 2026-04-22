import { motion } from "framer-motion";
import type { JSX, MouseEvent } from "react";
import type {
  NavbarLocale,
  NavbarLocaleOption,
  NavbarTab,
} from "@/modules/public-site/presentation/navbar/navbar.config";

type NavbarDesktopProps = {
  isDesktopView: boolean;
  active: string;
  t: (key: string) => string;
  tabIds: readonly NavbarTab[];
  goto: (id: string) => (e?: MouseEvent) => void;
  prefersReduced: boolean;
  locales: readonly NavbarLocaleOption[];
  pathname: string;
  currentLocale: NavbarLocale | string;
  LocaleFlag: (props: {
    locale: NavbarLocale;
    size?: "md" | "lg";
  }) => JSX.Element;
};

const NavbarDesktop = ({
  isDesktopView,
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
      className={`relative items-center gap-1 ${isDesktopView ? "flex" : "hidden flex-none"}`}
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
      <span className="ml-2 flex items-center gap-1.5 pl-2 text-sm text-white/90">
        {locales.map(({ locale, label }, i) => (
          <span key={locale} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>|</span>}
            <a
              href={`/${locale}${pathname === "/" ? "" : pathname}`}
              title={label}
              aria-label={label}
              className={
                currentLocale === locale
                  ? "opacity-100  rounded-sm"
                  : "opacity-60 hover:opacity-100"
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
