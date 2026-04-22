"use client";

import { useEffect, useState } from "react";

type UseNavbarViewportResult = {
    isDesktopView: boolean;
};

export function useNavbarViewport(): UseNavbarViewportResult {
    const [isDesktopView, setIsDesktopView] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        const apply = (): void => {
            setIsDesktopView(mediaQuery.matches);
        };

        apply();
        mediaQuery.addEventListener("change", apply);

        return () => {
            mediaQuery.removeEventListener("change", apply);
        };
    }, []);

    return {
        isDesktopView,
    };
}