import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { JSX, MouseEvent, RefObject } from "react";

type Tab = { id: string; key: string };
type Locale = "ca" | "es" | "en" | "fr" | "de";
type LocaleOption = { locale: Locale; label: string };

type NavbarMobileProps = {
  isMobileView: boolean;
  showBrandMobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  t: (key: string) => string;
  active: string;
  tabIds: readonly Tab[];
  goto: (id: string) => (e?: MouseEvent) => void;
  prefersReduced: boolean;
  itemVariants: Variants;
  panelVariants: Variants;
  overlayVariants: Variants;
  locales: readonly LocaleOption[];
  pathname: string;
  currentLocale: Locale | string;
  LocaleFlag: (props: { locale: Locale; size?: "md" | "lg" }) => JSX.Element;
  closeBtnRef: RefObject<HTMLButtonElement | null>;
};

const NavbarMobile = ({
  isMobileView,
  showBrandMobile,
  open,
  setOpen,
  t,
  active,
  tabIds,
  goto,
  prefersReduced,
  itemVariants,
  panelVariants,
  overlayVariants,
  locales,
  pathname,
  currentLocale,
  LocaleFlag,
  closeBtnRef,
}: NavbarMobileProps) => {
  return (
    <>
      <button
        aria-label={t("openMenu")}
        className={
          isMobileView ? (showBrandMobile ? "text-[#222831]" : "text-[#EEEEEE]") : "hidden"
        }
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && isMobileView && (
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

              {tabIds.map((tab, idx) => {
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
                    className={`relative text-white/90 text-2xl font-semibold px-3 py-1 transition-colors ${
                      isActive ? "text-white" : "hover:text-white"
                    } after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-white after:transition-[width] after:duration-300 ${
                      isActive ? "after:w-1/2" : "hover:after:w-1/2"
                    }`}
                  >
                    {t(tab.key)}
                  </motion.a>
                );
              })}

              <motion.div
                className="mt-4 flex flex-col items-center gap-3 text-white/90"
                variants={itemVariants}
              >
                {[locales.slice(0, 3), locales.slice(3)].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-6">
                    {row.map(({ locale, label }, idx) => (
                      <motion.a
                        key={locale}
                        href={`/${locale}${pathname === "/" ? "" : pathname}`}
                        title={label}
                        aria-label={label}
                        className={
                          currentLocale === locale
                            ? "opacity-100 rounded-sm"
                            : "opacity-70 hover:opacity-100"
                        }
                        aria-current={currentLocale === locale ? "true" : undefined}
                        initial={prefersReduced ? false : { opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={
                          prefersReduced
                            ? { duration: 0 }
                            : {
                                duration: 0.35,
                                delay: 0.1 + (rowIndex * 3 + idx) * 0.04,
                                ease: [0.25, 0.1, 0.25, 1],
                              }
                        }
                      >
                        <LocaleFlag locale={locale} size="lg" />
                      </motion.a>
                    ))}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMobile;
