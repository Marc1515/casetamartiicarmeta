"use client";

import { useEffect, useState, type FocusEvent } from "react";

type UseReservationDialogMobileParams = {
    open: boolean;
};

type UseReservationDialogMobileResult = {
    isMobile: boolean;
    preventDialogAutoFocus: (event: Event) => void;
    blurInputOnMobile: (event: FocusEvent<HTMLElement>) => void;
};

export function useReservationDialogMobile({
    open,
}: UseReservationDialogMobileParams): UseReservationDialogMobileResult {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const updateIsMobile = () => {
            setIsMobile(mediaQuery.matches);
        };

        updateIsMobile();
        mediaQuery.addEventListener("change", updateIsMobile);

        return () => {
            mediaQuery.removeEventListener("change", updateIsMobile);
        };
    }, []);

    useEffect(() => {
        if (!isMobile || !open) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            const activeElement = document.activeElement as HTMLElement | null;

            if (activeElement && typeof activeElement.blur === "function") {
                activeElement.blur();
            }
        }, 50);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isMobile, open]);

    function preventDialogAutoFocus(event: Event) {
        if (isMobile) {
            event.preventDefault();
        }
    }

    function blurInputOnMobile(event: FocusEvent<HTMLElement>) {
        if (isMobile && typeof event.target.blur === "function") {
            event.target.blur();
        }
    }

    return {
        isMobile,
        preventDialogAutoFocus,
        blurInputOnMobile,
    };
}