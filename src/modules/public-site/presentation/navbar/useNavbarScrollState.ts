"use client";

import { useEffect, useRef, useState } from "react";
import type { NavbarTab } from "@/modules/public-site/presentation/navbar/navbar.config";

type UseNavbarScrollStateInput = {
    isDesktopView: boolean;
    active: string;
    tabs: readonly NavbarTab[];
    setActive: (id: string) => void;
};

type UseNavbarScrollStateResult = {
    scrolled: boolean;
    showBrandMobile: boolean;
    prefersReduced: boolean;
    goto: (id: string) => (event?: React.MouseEvent) => void;
};

export function useNavbarScrollState({
    isDesktopView,
    active,
    tabs,
    setActive,
}: UseNavbarScrollStateInput): UseNavbarScrollStateResult {
    const [scrolled, setScrolled] = useState(false);
    const [showBrandMobile, setShowBrandMobile] = useState(false);

    const sectionElementsRef = useRef<HTMLElement[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const spyLockedRef = useRef(false);
    const unlockTimerRef = useRef<number | null>(null);

    const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        const onScroll = (): void => {
            setScrolled(window.scrollY > 10);
        };

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

        const calendarElement = document.getElementById("calendario");

        if (!calendarElement) {
            setShowBrandMobile(active !== "home");
            return;
        }

        const navigationHeight = 0;
        let animationFrameId: number | null = null;

        const update = (): void => {
            animationFrameId = null;

            const rect = calendarElement.getBoundingClientRect();
            const shouldShow = rect.top <= navigationHeight + 1;

            setShowBrandMobile(shouldShow);
        };

        const onScrollOrResize = (): void => {
            if (animationFrameId !== null) {
                return;
            }

            animationFrameId = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);

            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [active]);

    useEffect(() => {
        sectionElementsRef.current = tabs
            .map((tab) => document.getElementById(tab.id))
            .filter(Boolean) as HTMLElement[];

        const navigationHeight = isDesktopView ? 80 : 64;

        const computeActive = (): void => {
            if (spyLockedRef.current) {
                return;
            }

            const sections = sectionElementsRef.current;

            if (!sections.length) {
                return;
            }

            const thresholdY = window.scrollY + navigationHeight + 1;
            let nextActive = sections[0]?.id;

            for (const element of sections) {
                if (element.offsetTop <= thresholdY) {
                    nextActive = element.id;
                    continue;
                }

                break;
            }

            if (nextActive) {
                setActive(nextActive);
            }
        };

        const onScrollOrResize = (): void => {
            if (animationFrameRef.current !== null) {
                return;
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                animationFrameRef.current = null;
                computeActive();
            });
        };

        computeActive();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);

            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (unlockTimerRef.current !== null) {
                clearTimeout(unlockTimerRef.current);
            }
        };
    }, [isDesktopView, setActive, tabs]);

    const goto = (id: string) => (event?: React.MouseEvent): void => {
        event?.preventDefault();

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        setActive(id);

        spyLockedRef.current = true;

        if (unlockTimerRef.current !== null) {
            clearTimeout(unlockTimerRef.current);
        }

        unlockTimerRef.current = window.setTimeout(() => {
            spyLockedRef.current = false;
            unlockTimerRef.current = null;
        }, 1200);

        element.scrollIntoView({ behavior: "smooth", block: "start" });

        if (history.replaceState) {
            history.replaceState(null, "", `#${id}`);
        }
    };

    return {
        scrolled,
        showBrandMobile,
        prefersReduced,
        goto,
    };
}