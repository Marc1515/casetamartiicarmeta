"use client";

import { useState } from "react";
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
import { useNavbarViewport } from "@/modules/public-site/presentation/navbar/useNavbarViewport";
import { useNavbarMenu } from "@/modules/public-site/presentation/navbar/useNavbarMenu";
import { useNavbarScrollState } from "@/modules/public-site/presentation/navbar/useNavbarScrollState";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const t = useTranslations("nav");
  const currentLocale = useLocale();
  const pathname = usePathname();

  const [active, setActive] = useState<string>(NAVBAR_TAB_IDS[0].id);

  const { isDesktopView } = useNavbarViewport();
  const { open, setOpen, closeBtnRef } = useNavbarMenu();
  const { scrolled, showBrandMobile, prefersReduced, goto } =
    useNavbarScrollState({
      isDesktopView,
      active,
      tabs: NAVBAR_TAB_IDS,
      setActive,
    });

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
      <div className="mx-auto max-w-7xl px-4">
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
